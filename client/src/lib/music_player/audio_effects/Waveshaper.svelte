<script lang="ts">
  import { CUSTOM_NODE_NAME, WAVESHAPER_CURVE_TYPE } from "../enums"
  import { generateDistortionCurve } from "../waveshaper"
  import { musicPlayer } from "src/lib/music_player/MusicPlayerBase.svelte"
  import { onDestroy, onMount } from "svelte"
  import { scaleLinear, line } from "d3"
  import EffectTemplate from "./EffectTemplate.svelte"
  import Knob from "./Knob.svelte"
  import type { Unsubscriber } from "svelte/store"
  
  export let color ="#7469ff"
  export let height =200
  export let width =220

  const curveTypes =[ "Soft Clip","Hard Clip","Linear Fold" ]
  const grandientId =`${Math.random()}`
  const resolution =99
  
  $: presetStore =musicPlayer.audioEffects?.presetStore
  $: active =($presetStore?.sequence || []).indexOf(CUSTOM_NODE_NAME.WAVESHAPER) !== -1
  $: _color =active ? color : "#444"
  $: x =scaleLinear()
    .domain([0,resolution])
    .range([0,width])
  
  $: y =scaleLinear()
    .domain([1,-1])
    .range([0,height])

  $: lineGenerator =line<number>()
    .x((_,i) => x(i))
    .y(i => y(i))

  $: pathFill =lineGenerator( [0,...Array.from(generateDistortionCurve(intensity,curveType,resolution)),0] ) || ""
  $: pathStroke =pathFill
    .replace(/^M[\d.]+,[\d.]+L/,"M")
    .replace(/L[\d.]+,[\d.]+$/,"")

  let unsubscribe:undefined|Unsubscriber
  
  onMount(() => {
    if ( !presetStore ) return
    unsubscribe =presetStore.subscribe(({ waveshaper }) => {
      wet =waveshaper.wet
      dry =waveshaper.dry
      curveType =waveshaper.curveType
      intensity =waveshaper.intensity
    })
  })

  onDestroy(() => typeof unsubscribe === "function" && unsubscribe() )


  let dry =$presetStore?.waveshaper.dry ?? 0
  let wet =$presetStore?.waveshaper.wet ?? 0.8
  let curveType =$presetStore?.waveshaper?.curveType ?? WAVESHAPER_CURVE_TYPE.HARD_CLIP 
  let intensity =$presetStore?.waveshaper?.intensity ?? 1

  function handleToggleButton(e:CustomEvent) {
    if ( !musicPlayer.audioEffects ) return
    const { sequence =[] } =musicPlayer.audioEffects.currentPreset
    const active =e.detail as boolean
    
    const isWaveshaperInSequence =sequence.indexOf(CUSTOM_NODE_NAME.WAVESHAPER) !== -1
    
    if ( active && !isWaveshaperInSequence ) sequence?.push(CUSTOM_NODE_NAME.WAVESHAPER)
    if ( !active && isWaveshaperInSequence ) sequence?.splice(sequence.indexOf(CUSTOM_NODE_NAME.WAVESHAPER),1)

    musicPlayer.audioEffects.loadEffectChain({ sequence, waveshaper: { dry, wet, curveType, intensity }})
  }

</script>

<EffectTemplate color={_color} bind:active on:change={handleToggleButton} effectName="Waveshaper">
  <div class="curve-monitor bg-neutral-800 w-40 h-40">
    <svg fill="none"
      class="w-full h-full"
      viewBox="0 0 {width} {height}">
      <linearGradient id={grandientId} x1=0 y1=0 x2=0 y2=1>
        <stop offset="0%" stop-color={_color}/>
        <stop offset="50%" stop-color="transparent"/>
        <stop offset="100%" stop-color={_color}/>
      </linearGradient>

      <path d={pathFill} fill="url(#{grandientId})" />
      <path d={pathStroke} stroke-width=4 stroke={_color} stroke-linejoin="round" />
    </svg>
  </div>

  <div class="flex flex-wrap w-32 justify-center">
    <Knob
      defaultValue={0}
      min={0} max={1} step={0.02}
      label="dry" color={_color}
      bind:value={dry}
      on:change={e => active && musicPlayer.audioEffects?.changeEffectParam({waveshaper:{dry:e.detail}})} />

    <Knob
      defaultValue={0.8}
      min={0} max={1} step={0.02}
      label="wet" color={_color}
      bind:value={wet}
      on:change={e => active && musicPlayer.audioEffects?.changeEffectParam({waveshaper:{wet:e.detail}})} />

    <Knob
      class="w-20"
      defaultValue={1}
      min={0} max={20} step={0.1}
      label="drive" color={_color}
      bind:value={intensity}
      on:change={e => active && musicPlayer.audioEffects?.changeEffectParam({waveshaper:{intensity:e.detail}})} />
  </div>

  <select bind:value={curveType} on:change={e => active && musicPlayer.audioEffects?.changeEffectParam({waveshaper:{ curveType }})}>
    {#each curveTypes as caption,value}
      <option {value}>{caption}</option>
    {/each}
  </select>

</EffectTemplate>