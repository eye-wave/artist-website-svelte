<script lang="ts">
  import { musicPlayer } from "src/lib/MusicPlayer.svelte"
  import { getCoordinatesFromEvent } from "src/utils/mouseEvent"
  import { onMount } from "svelte"
  import EffectTemplate from "./EffectTemplate.svelte"
  import { scaleLinear, line, curveCardinal as curve } from "d3"
  import { gainToValue, hzToValue, valueToGain, valueToHz } from "src/utils/filters"  
  // import Knob from "./Knob.svelte"

  export let color ="#7469ff"
  export let width =360
  export let height =220

  type Filter ={
    id: number,
    type: BiquadFilterType,
    frequency: number,
    gain: number,
    Q: number,
  }

  $: x =scaleLinear()
    .domain([0,50])
    .range([0,width])

  $: y =scaleLinear()
    .domain([2,0])
    .range([0,height])

  $: lineGenerator =line<number>()
    .x((d,i) => x(i))
    .y(d => y(d))
    .curve(curve)

  const pointRadius =10
  const defaultFilters:Filter[] =[
    { id: 0, type: "lowshelf", frequency: 82.4, gain: 0, Q: 10 },
    { id: 1, type: "peaking", frequency: 830.6, gain: 0, Q: 10 },
    { id: 2, type: "lowpass", frequency: 2637, gain: 0, Q: 10 },
  ]

  let eqCurvePath =`M0 ${height /2} L${width} ${height/2}`
  let active =(musicPlayer.currentPreset.sequence || []).indexOf("eq") !== -1
  let mouseDown =false
  let currentPoint:Filter|null =null

  let filters:Filter[] =defaultFilters.map((df,i) => {
    const mf =musicPlayer.currentPreset?.eq?.[i]
    
    return {
      id: i,
      type: mf?.type || df.type,
      frequency: mf?.frequency || df.frequency,
      gain: mf?.gain || df.gain,
      Q: mf?.Q || df.Q,
    }
  })

  let boundingRect:DOMRect
  let curveMonitor:HTMLDivElement
  function onWinResize() {
    const relativeRect =curveMonitor?.getBoundingClientRect()
    const absoluteRect =new DOMRect(
      relativeRect.x +window.scrollX,
      relativeRect.y +window.scrollY,
      relativeRect.width,
      relativeRect.height
    )
    
    boundingRect =absoluteRect
  }
  onMount(onWinResize)

  function getTranslatedCordsFromEvent(e:MouseEvent|TouchEvent) {
    let { x, y } = getCoordinatesFromEvent(e)
    
    x = (x -boundingRect.left) / boundingRect.width * width
    y = (y -boundingRect.top) / boundingRect.height * height
    return { x,y }
  }

  function getClosestPoints(x:number,y:number) {
    const radius =35
    return filters.filter(f => {
      const _x =hzToValue(f.frequency,width)
      const _y =gainToValue(f.gain,height)

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

    currentPoint.frequency =valueToHz(x,width)
    currentPoint.gain =valueToGain(y,height)
    filters =filters

    eqCurvePath =lineGenerator(musicPlayer?.audioEffects?.getEqCurve(filters) || new Float32Array(50)) || ""
  }

  function handleGrabEnd(e:MouseEvent|TouchEvent) {
    if ( !mouseDown ) return

    mouseDown =false
    currentPoint =null

    musicPlayer.changeEffectParam({ eq: filters })
    console.table(filters)
  }

  function handleToggleButton(e:CustomEvent) {
    const { sequence =[] } =musicPlayer.currentPreset
    const active =e.detail as boolean

    const isEqInSequence =sequence.indexOf("eq") !== -1
    
    if ( active && !isEqInSequence ) sequence?.push("eq")
    if ( !active && isEqInSequence ) sequence?.splice(sequence.indexOf("eq"),1)

    musicPlayer.loadEffectChain({
      ...musicPlayer.currentPreset ,sequence,
      eq: filters
    })
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
        {@const cx =hzToValue(filter.frequency,width)}
        {@const cy =gainToValue(filter.gain,height)}

        <circle {cy} {cx} {r} fill={color} />

      {/each}

      <path d={eqCurvePath} stroke-width=5 stroke={color} stroke-linejoin="round" />
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
