<script lang="ts">
  import { CUSTOM_NODE_NAME, WAVESHAPER_CURVE_TYPE } from "../enums"
  import { generateDistortionCurve } from "../waveshaper"
  import { line } from "d3-shape"
  import { musicPlayer } from "$lib/music_player"
  import { onDestroy, onMount } from "svelte"
  import { scaleLinear } from "d3-scale"
  import EffectTemplate from "./EffectTemplate.svelte"
  import Knob from "./Knob.svelte"
  import type { Unsubscriber } from "svelte/store"

  export let color = "#7469ff"
  export let height = 200
  export let width = 220

  const curveTypes = ["Soft Clip", "Hard Clip", "Linear Fold"]
  const grandientId = `${Math.random()}`
  const resolution = 99

  let unsubscribe: undefined | Unsubscriber
  let windowWidth = 300

  $: _color = active ? color : "#444"
  $: active = ($presetStore?.sequence || []).indexOf(CUSTOM_NODE_NAME.WAVESHAPER) !== -1
  $: presetStore = musicPlayer.audioEffects?.presetStore
  $: x = scaleLinear().domain([0, resolution]).range([0, width])
  $: y = scaleLinear().domain([1, -1]).range([0, height])

  $: lineGenerator = line<number>()
    .x((_, i) => x(i))
    .y(i => y(i))

  $: pathFill = lineGenerator([0, ...Array.from(generateDistortionCurve(intensity, curveType, resolution)), 0]) || ""
  $: pathStroke = pathFill.replace(/^M[\d.]+,[\d.]+L/, "M").replace(/L[\d.]+,[\d.]+$/, "")

  onMount(() => {
    if (!presetStore) return
    unsubscribe = presetStore.subscribe(({ waveshaper }) => {
      wet = waveshaper.wet
      dry = waveshaper.dry
      curveType = waveshaper.curveType
      intensity = waveshaper.intensity
    })
  })

  onDestroy(() => typeof unsubscribe === "function" && unsubscribe())

  let curveType = $presetStore?.waveshaper?.curveType ?? WAVESHAPER_CURVE_TYPE.HARD_CLIP
  let dry = $presetStore?.waveshaper.dry ?? 0
  let intensity = $presetStore?.waveshaper?.intensity ?? 1
  let wet = $presetStore?.waveshaper.wet ?? 0.8

  function handleToggleButton(e: CustomEvent) {
    if (!musicPlayer.audioEffects) return
    const { sequence = [] } = musicPlayer.audioEffects.currentPreset
    const active = e.detail as boolean

    const isWaveshaperInSequence = sequence.indexOf(CUSTOM_NODE_NAME.WAVESHAPER) !== -1

    if (active && !isWaveshaperInSequence) sequence?.push(CUSTOM_NODE_NAME.WAVESHAPER)
    if (!active && isWaveshaperInSequence) sequence?.splice(sequence.indexOf(CUSTOM_NODE_NAME.WAVESHAPER), 1)

    musicPlayer.audioEffects.loadEffectChain({
      sequence,
      waveshaper: { dry, wet, curveType, intensity },
    })
  }

  function onWinResize() {
    windowWidth = window.innerWidth
  }
  onMount(onWinResize)
</script>

<svelte:window on:resize={onWinResize} />

<EffectTemplate color={_color} bind:active on:change={handleToggleButton} effectName="Waveshaper">
  <div class="my-2">
    <select
      bind:value={curveType}
      on:change={() => active && musicPlayer.audioEffects?.changeEffectParam({ waveshaper: { curveType } })}
    >
      {#each curveTypes as caption, value}
        <option value={value + 1}>{caption}</option>
      {/each}
    </select>

    {#if windowWidth > 400}
      <div class="curve-monitor h-40 w-40 bg-neutral-800">
        <svg fill="none" class="h-full w-full" viewBox="0 0 {width} {height}">
          <linearGradient id={grandientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color={_color} />
            <stop offset="50%" stop-color="transparent" />
            <stop offset="100%" stop-color={_color} />
          </linearGradient>

          <path d={pathFill} fill="url(#{grandientId})" />
          <path d={pathStroke} stroke-width="4" stroke={_color} stroke-linejoin="round" />
        </svg>
      </div>
    {/if}
  </div>

  <div class="flex w-32 flex-wrap justify-center">
    <Knob
      on:change={e => active && musicPlayer.audioEffects?.changeEffectParam({ waveshaper: { dry: e.detail } })}
      bind:value={dry}
      color={_color}
      defaultValue={0}
      label="dry"
      min={0}
      max={1}
      step={0.02}
    />

    <Knob
      on:change={e => active && musicPlayer.audioEffects?.changeEffectParam({ waveshaper: { wet: e.detail } })}
      bind:value={wet}
      color={_color}
      defaultValue={0.8}
      label="wet"
      min={0}
      max={1}
      step={0.02}
    />

    <Knob
      on:change={e => active && musicPlayer.audioEffects?.changeEffectParam({ waveshaper: { intensity: e.detail } })}
      bind:value={intensity}
      class="w-20"
      color={_color}
      defaultValue={1}
      label="drive"
      min={0}
      max={20}
      step={0.1}
    />
  </div>
</EffectTemplate>
