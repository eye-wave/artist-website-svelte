<script lang="ts">
  import { musicPlayer } from "src/lib/MusicPlayer.svelte"
  import { getCoordinatesFromEvent } from "src/utils/mouseEvent";
  import { onMount } from "svelte"
  import EffectTemplate from "./EffectTemplate.svelte";
  // import Knob from "./Knob.svelte"

  export let color ="#7469ff"
  export let width =360
  export let height =220
  
  const logMin =Math.log10(20)
  const logMax =Math.log10(20000)

  const valueToHz =(input:number,min=0,max=width) => 10 ** (((input -min) / (max -min) * (logMax -logMin)) +logMin)
  const hzToValue = (hz: number, min = 0, max = width) => ((Math.log10(hz) - logMin) / (logMax - logMin)) * (max - min) + min
  
  const valueToGain = (input: number,min=0,max=height) => (input - min) / (max - min) * 2;
  const gainToValue = (input: number,min=0,max=height) => input * (max - min) / 2 + min;

  const pointRadius =10

  let active =false
  let mouseDown =false
  let currentPoint:Filter|null =null
  
  type Filter ={
    id: number,
    type: BiquadFilterType,
    frequency: number,
    gain: number,
    Q: number,
  }

  const defaultFilters:Filter[] =[
    {
      id: 0,
      type: "lowshelf",
      frequency: 82.4,
      gain: 1,
      Q: 1
    },
    {
      id: 1,
      type: "peaking",
      frequency: 830.6,
      gain: 1,
      Q: 1
    },
    {
      id: 2,
      type: "lowpass",
      frequency: 2637,
      gain: 1,
      Q: 1
    },
  ]

  let filters =defaultFilters.map(obj => Object.assign({},obj))

  let boundingRect:DOMRect
  let curveMonitor:HTMLDivElement
  function onWinResize() { boundingRect =curveMonitor?.getBoundingClientRect() }
  onMount(onWinResize)

  function getTranslatedCordsFromEvent(e:MouseEvent|TouchEvent) {
    let { x, y } = getCoordinatesFromEvent(e)
    
    x = (x -boundingRect.left) / boundingRect.width * width
    y = (y -boundingRect.top) / boundingRect.height * height
    return { x,y }
  }

  function getClosestPoints(x:number,y:number) {
    const radius =20
    return filters.filter(f => {
      const _x =hzToValue(f.frequency)
      const _y =gainToValue(f.gain)

      const distance =Math.hypot(x -_x,y -_y)
      return distance <= radius
    })
  }

  function handleDblClick(e:MouseEvent|TouchEvent) {
    const { x,y } =getTranslatedCordsFromEvent(e)
    const [ point ] =getClosestPoints(x,y)

    
    if ( !point ) return
    
    const [ defaultPoint ] =defaultFilters.filter(f => f.id === point.id )
    if ( !defaultPoint ) return console.warn(`no default filter found for ${point.id}`)
    
    point.frequency =defaultPoint.frequency
    point.gain =defaultPoint.gain
    point.Q =defaultPoint.Q
    point.type =defaultPoint.type
    
    filters =filters
    console.log(point)
  }

  function handleGrabStart(e:MouseEvent|TouchEvent) {
    mouseDown =true
    
    const { x,y } =getTranslatedCordsFromEvent(e)
    const [ closest ] =getClosestPoints(x,y)

    if ( !closest ) currentPoint =null
    currentPoint =closest
  }

  function handleGrab(e:MouseEvent|TouchEvent) {
    if ( !mouseDown ) return
    if ( !currentPoint ) return
    
    const { x,y } =getTranslatedCordsFromEvent(e)

    currentPoint.frequency =valueToHz(x)
    currentPoint.gain =valueToGain(y)
    filters =filters
  }

  function handleGrabEnd(e:MouseEvent|TouchEvent) {
    if ( !mouseDown ) return
    // const { x,y } =getTranslatedCordsFromEvent(e)

    mouseDown =false
    currentPoint =null

    musicPlayer.changeEffectParam({ eq: filters })
  }

  function handleToggleButton(e:CustomEvent) {
    const { sequence =[] } =musicPlayer.currentPreset
    const active =e.detail as boolean

    if ( active ) sequence?.push("eq")
    else sequence?.splice(sequence.indexOf("eq"),1)

    musicPlayer.loadEffectChain({
      ...musicPlayer.currentPreset ,sequence,
      eq: filters
    })

    console.log(musicPlayer.currentPreset.sequence)
  }

</script>

<svelte:window 
  on:mouseup={handleGrabEnd}
  on:resize={onWinResize}/>

<EffectTemplate {color} bind:active on:change={handleToggleButton} effectName="EQ">
  <div
    bind:this={curveMonitor}
    on:dblclick={handleDblClick}
    on:mousedown={handleGrabStart}
    on:mousemove={handleGrab}
    class="curve-monitor bg-neutral-500 w-fit">

    <svg fill="none"
      class="w-full h-full" {width} {height}
      viewBox="0 0 {width} {height}">
      
      {#each filters as filter}
        {@const r =pointRadius}
        {@const cx =hzToValue(filter.frequency)}
        {@const cy =gainToValue(filter.gain)}

        <circle {cy} {cx} {r} fill="#000" />

      {/each}
    </svg>
  </div>
</EffectTemplate>

<style>
  .curve-monitor {
    background-image: 
      linear-gradient(45deg, #333 25%, transparent 25.1%, transparent 74.9%, #333 75%),
      linear-gradient(45deg, #333 25%, #444 25.1%, #444 74.9%, #333 75%);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
  }
</style>
