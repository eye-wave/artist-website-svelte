import { compareArrays } from "src/utils/array"
import { derived, writable } from "svelte/store"
import impulseAudioSource from "../audio/impulse.opus"
import { CUSTOM_NODE_NAME, PRESET_NAMES, WAVESHAPER_CURVE_TYPE, type T_CUSTOM_NODE_NAME, type T_PRESET_NAMES } from "./enums"
import { createReverbNode, type ReverbNode, type ReverbOptions } from "./reverb"
import { createWaveShaperNode, type WaveShaperNode, type WaveShaperOptions } from "./waveshaper"

export type CustomAudioNode = ReverbNode | WaveShaperNode

export type Preset = { name: T_PRESET_NAMES } & Partial<EffectChainOptions>
export const AudioPresets: Preset[] = [
  {
    name: PRESET_NAMES.SAD,
    sequence: [CUSTOM_NODE_NAME.REVERB],
    reverb: {
      dry: 0.6,
      wet: 0.4,
    },
    speed: 0.82,
  },
  {
    name: PRESET_NAMES.HAPPY,
    sequence: [CUSTOM_NODE_NAME.WAVESHAPER, CUSTOM_NODE_NAME.REVERB],
    waveshaper: {
      curveType: WAVESHAPER_CURVE_TYPE.SOFT_CLIP,
      intensity: 1.5,
      dry: 0,
      wet: 1,
    },
    reverb: {
      dry: 0.8,
      wet: 0.1,
    },
    speed: 1.13,
  },
  {
    name: PRESET_NAMES.NORMAL,
    sequence: [],
    speed: 1,
  },
  {
    name: PRESET_NAMES.ANGRY,
    sequence: [CUSTOM_NODE_NAME.WAVESHAPER],
    waveshaper: {
      curveType: WAVESHAPER_CURVE_TYPE.HARD_CLIP,
      intensity: 10,
      wet: 0.2,
      dry: 0,
    },
    speed: 1,
  },
]

export type EffectChainOptions = {
  sequence: T_CUSTOM_NODE_NAME[]
  reverb: ReverbOptions
  waveshaper: WaveShaperOptions
  speed: number
}

export type AudioEffects = ReturnType<typeof createAudioEffects>
export function createAudioEffects(context: AudioContext, audioElement: HTMLAudioElement) {
  const currentPreset = {
    sequence: [] as T_CUSTOM_NODE_NAME[],
    reverb: { dry: 0.4, wet: 0.5 },
    speed: 1,
    waveshaper: {
      curveType: WAVESHAPER_CURVE_TYPE.HARD_CLIP,
      dry: 0,
      wet: 0.4,
      intensity: 1,
      resolution: 200,
    },
  }

  const presetStore = writable(currentPreset)

  const reverbNode = createReverbNode(context)
  const waveshaperNode = createWaveShaperNode(context)

  reverbNode.loadImpulseResponse(impulseAudioSource)
  const mediaSource = context.createMediaElementSource(audioElement)

  const analyserNode = context.createAnalyser()
  analyserNode.fftSize = 8192

  const setSongProperties = (options: Partial<Omit<EffectChainOptions, "sequence">>) => {
    if (!options.speed) return (audioElement.playbackRate = currentPreset.speed || 1)

    currentPreset.speed = options.speed
    audioElement.playbackRate = options.speed
    audioElement.preservesPitch = false
  }

  const setReverbProperties = (options: Partial<Omit<EffectChainOptions, "sequence">>) => {
    if (!options.reverb) return
    const { dry, wet } = options.reverb

    reverbNode.setDryAtTime(dry ?? currentPreset.reverb.dry)
    currentPreset.reverb.dry = dry ?? currentPreset.reverb.dry

    reverbNode.setWetAtTime(wet ?? currentPreset.reverb.wet)
    currentPreset.reverb.wet = wet ?? currentPreset.reverb.wet
  }

  const setWaveshaperProperties = (options: Partial<Omit<EffectChainOptions, "sequence">>) => {
    if (!options.waveshaper) return
    const { dry, wet, curveType, intensity } = options.waveshaper

    waveshaperNode.setDryAtTime(dry ?? currentPreset.waveshaper.dry)
    currentPreset.waveshaper.dry = dry ?? currentPreset.waveshaper.dry

    waveshaperNode.setWetAtTime(wet ?? currentPreset.waveshaper.wet)
    currentPreset.waveshaper.wet = wet ?? currentPreset.waveshaper.wet

    waveshaperNode.curveType = curveType ?? currentPreset.waveshaper.curveType
    currentPreset.waveshaper.curveType = curveType ?? currentPreset.waveshaper.curveType

    waveshaperNode.intensity = intensity ?? currentPreset.waveshaper.intensity
    currentPreset.waveshaper.intensity = intensity ?? currentPreset.waveshaper.intensity
  }

  const getNodeByName = (nodeName: T_CUSTOM_NODE_NAME) => {
    switch (nodeName) {
      case CUSTOM_NODE_NAME.REVERB:
        return reverbNode
      case CUSTOM_NODE_NAME.WAVESHAPER:
        return waveshaperNode
      default:
        return
    }
  }

  return {
    get analyzer() {
      return analyserNode
    },
    get currentPreset() {
      return currentPreset
    },
    get presetStore() {
      return derived(presetStore, p => p)
    },

    loadPreset(presetName: T_PRESET_NAMES) {
      const [preset] = AudioPresets.filter(f => f.name === presetName)

      switch (preset.name) {
        case PRESET_NAMES.SAD:
          document.documentElement.dataset.mood = "sad"
          break
        case PRESET_NAMES.HAPPY:
          document.documentElement.dataset.mood = "happy"
          break
        case PRESET_NAMES.ANGRY:
          document.documentElement.dataset.mood = "angry"
          break
        default:
          document.documentElement.removeAttribute("data-mood")
      }

      this.loadEffectChain(preset)
    },

    changeEffectParam(options: Partial<Omit<EffectChainOptions, "sequence">>) {
      setSongProperties(options)
      setReverbProperties(options)
      setWaveshaperProperties(options)

      presetStore.set(currentPreset)

      return this
    },

    loadEffectChain(options?: Partial<EffectChainOptions>) {
      analyserNode.disconnect()
      mediaSource.disconnect()
      reverbNode.disconnect()
      waveshaperNode.disconnect()

      this.changeEffectParam(options || {})
      const sequence = options?.sequence ?? currentPreset.sequence ?? []

      if (!compareArrays(sequence, currentPreset.sequence)) {
        currentPreset.sequence = [...sequence]
        presetStore.set(currentPreset)
      }

      if (sequence.length < 1) mediaSource.connect(analyserNode)

      sequence.forEach((nodeName, i) => {
        const currentNode = getNodeByName(nodeName)
        const nextNodeName = sequence[i + 1]
        const nextNode = getNodeByName(nextNodeName)

        if (!currentNode) return
        if (i === 0) mediaSource.connect(currentNode.node)
        if (!nextNode) return currentNode.connect(analyserNode)

        currentNode.connect(nextNode.node)
      })

      analyserNode.connect(context.destination)

      return this
    },
  }
}
