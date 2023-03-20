import impulseAudioSource from "../audio/impulse.opus"
import { createEQNode, type EQBandOptions, type EQNode } from "./eq"
import { createReverbNode, type ReverbNode, type ReverbOptions } from "./reverb"
import { createWaveShaperNode, type WaveShaperNode, type WaveShaperOptions } from "./waveshaper"

export type CustomAudioNode =EQNode | ReverbNode | WaveShaperNode

export type CustomNodeName ="eq" | "reverb" | "waveshaper"
export type EffectName =CustomNodeName | "speed"
export type EffectChainOptions ={
  sequence?: CustomNodeName[],
  eq?: EQBandOptions[],
  reverb?: ReverbOptions,
  waveshaper?: WaveShaperOptions,
  speed?: number,
}

export type AudioEffects ={
  readonly analyzer: AnalyserNode,
  getEqCurve:(filters:EQBandOptions[],size?:number)=>Float32Array,
  loadEffectChain(options?: EffectChainOptions):AudioEffects,
  changeEffectParam(options: Omit<EffectChainOptions,"sequence">):AudioEffects
}
export function createAudioEffects( context:AudioContext, audioElement:HTMLAudioElement ):AudioEffects {
  
  const nodes =new Map<EffectName,CustomAudioNode>()
  
  const reverbNode =createReverbNode( context )
  const eqNode =createEQNode( context )
  const waveshaperNode =createWaveShaperNode( context )

  reverbNode.loadImpulseResponse( impulseAudioSource )

  nodes.set("eq",eqNode)
  nodes.set("reverb",reverbNode)
  nodes.set("waveshaper",waveshaperNode)


  const mediaSource = context.createMediaElementSource( audioElement )
  const analyserNode = context.createAnalyser()
  analyserNode.fftSize =8192

  
  
  const setSongProperties =(options: EffectChainOptions) => {
    audioElement.playbackRate =options.speed || 1
    audioElement.preservesPitch =false
  }

  const setReverbProperties =(options: EffectChainOptions) => {
    reverbNode.setDryWetAtTime(
      options.reverb?.dry || 0,
      options.reverb?.wet || 0,
    )
  }

  const setEQProperties =(options: EffectChainOptions) => {
    options.eq?.forEach((band, i) => {
      if (band.frequency !== undefined) eqNode.setBandFrequencyAtTime(i, band.frequency)
      if (band.Q !== undefined) eqNode.setBandQAtTime(i, band.Q)
      if (band.gain !== undefined) eqNode.setBandGainAtTime(i, band.gain)
      if (band.type !== undefined) eqNode.setBandType(i, band.type)
    })
  }

  const setWaveshaperProperties =(options: EffectChainOptions) => {
    if (options.waveshaper?.curve) waveshaperNode.setCurve(options.waveshaper.curve)
    waveshaperNode.setDryWetAtTime(
      options.waveshaper?.dry || 0,
      options.waveshaper?.wet || 0,
    )
  }

  const handleNodeProperties =(nodeName: EffectName, options: EffectChainOptions) => {
    switch ( nodeName ) {
      case "eq": return setEQProperties(options)
      case "reverb": return setReverbProperties(options)
      case "waveshaper": return setWaveshaperProperties(options)
    }
  }


  return {
    get analyzer() { return analyserNode },

    getEqCurve: (options:EQBandOptions[],size=50) => eqNode.getCurveData(options,size),

    changeEffectParam(options: Omit<EffectChainOptions,"sequence">) {
      if ( options.speed !== undefined ) {
        audioElement.playbackRate =options.speed
      }

      if ( options.reverb ) {
        const { dry, wet } =options.reverb
        dry !== undefined && reverbNode.setDryAtTime(dry)
        wet !== undefined && reverbNode.setWetAtTime(wet)
      }

      if ( options.waveshaper ) {
        const { dry, wet, curve } =options.waveshaper
        dry !== undefined && waveshaperNode.setDryAtTime(dry)
        wet !== undefined && waveshaperNode.setWetAtTime(wet)
        curve && waveshaperNode.setCurve(curve)
      }

      options.eq?.forEach((filter,i) => {
        if ( !eqNode.filters[i] ) return
        
        const { Q, disabled, frequency, gain, type } =filter
                
        Q !== undefined && eqNode.setBandQAtTime(i,Q)
        frequency !== undefined && eqNode.setBandFrequencyAtTime(i,frequency)
        gain !== undefined && eqNode.setBandGainAtTime(i,gain)
        type !== undefined && eqNode.setBandType(i,type)
        
      })

      return this
    },

    loadEffectChain(options?: EffectChainOptions) {
      mediaSource.disconnect()
      analyserNode.disconnect()
      nodes.forEach(node => node?.disconnect())
  

      setSongProperties(options || {})

      const { sequence =[] } =options || {}
      if ( sequence.length < 1 ) mediaSource.connect( analyserNode )

      sequence.forEach((nodeName,i) => {
        const currentNode =nodes.get(nodeName)
        const nextNodeName =sequence[i + 1]
        const nextNode =nodes.get(nextNodeName)

        if ( !currentNode ) return

        handleNodeProperties(nodeName, options || {})        

        if ( i === 0 ) {
          mediaSource.connect( currentNode.node )
        }
        if ( !nextNode ) {
          return currentNode.connect( analyserNode )
        }

        currentNode.connect( nextNode.node )
      })

      analyserNode.connect( context.destination )

      return this
    }
  }
}
