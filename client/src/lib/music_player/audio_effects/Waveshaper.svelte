<script lang="ts">
  import { musicPlayer } from "src/lib/MusicPlayer.svelte"
  import { onMount } from "svelte"
  import { getCoordinatesFromEvent } from "src/utils/mouseEvent"
  import Knob from "./Knob.svelte"
  import EffectTemplate from "./EffectTemplate.svelte";
  import { scaleLinear, line } from "d3"


  let dry: number =musicPlayer.currentPreset.waveshaper?.dry || 0.8
  let wet: number =musicPlayer.currentPreset.waveshaper?.wet || 0.2
  
  export let active =musicPlayer.currentPreset.sequence?.includes("waveshaper") || false
  export let color ="#7469ff"
  export let resolution =30
  
  const margin =2
  let mouseDown =false
  
  $: width =resolution
  $: height =resolution
  
  const x =scaleLinear()
    .domain([0,resolution *2])
    .range([0,resolution])
  
  const y =scaleLinear()
    .domain([1,-1])
    .range([0,resolution])
  
  const linegenerator =line<Point>()
    .x(d => x(d.x))
    .y(d => y(d.y))

  let debugCurve =""


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

  type Point ={ x:number, y:number }
  let curvePoints:Point[] =[{x:0,y:resolution},{x:resolution,y:0}]
  
  const lineGenerator =(points:Point[]) => points.reduce((d,point) => d += `L${point.x} ${point.y}`,`M${curvePoints.at(0)?.x} ${curvePoints.at(0)?.y}`) 
  $: svgLine =lineGenerator(curvePoints)

  let currentPoint:null|Point =null
  let currentPointMinX =0
  let currentPointMaxX =width

  function handleDblClick(e:MouseEvent|TouchEvent) {
    const { x, y } = getTranslatedCordsFromEvent(e)

    const point = { x, y }
    for ( let i =1; i < curvePoints.length -1; i++ ) {
      const p =curvePoints[i]
      if ( p.x > x -margin && p.x < x +margin ) {
        if ( p.y > y -margin && p.y < y +margin ) {
          curvePoints =curvePoints.filter(point => point.x!== p.x || point.y!== p.y)
          musicPlayer.changeEffectParam({waveshaper:{curve: pointsToFloat32(curvePoints,width,height) }})

          return
        }
      }
    }

    curvePoints =[ ...curvePoints, point ].sort((a,b) => a.x -b.x)
    musicPlayer.changeEffectParam({waveshaper:{curve: pointsToFloat32(curvePoints,width,height) }})

    console.log(curvePoints)
  }

  function handleGrabStart(e:MouseEvent|TouchEvent) {
    let { x, y } =getTranslatedCordsFromEvent(e)
    
    mouseDown =true 

    const margin =4
    curvePoints.forEach((p,i) => {
      if ( p.x > x -margin && p.x < x +margin ) {
        if ( p.y > y -margin && p.y < y +margin ) {
          
          currentPoint =p
          currentPointMinX =((curvePoints[i -1] || curvePoints[0]).x || 0) + +(i > 0)
          currentPointMaxX =((curvePoints[i +1] || curvePoints.at(-1)).x || width) - +(i < curvePoints.length -1)

          return true
        }
      }
    })
  }


  function handleGrabEnd(e:MouseEvent|TouchEvent) {
    if ( !mouseDown ) return

    mouseDown =false
    if ( currentPoint ) musicPlayer.changeEffectParam({waveshaper:{curve: pointsToFloat32(curvePoints,width,height) }})
    currentPoint =null
  }


  function handleGrab(e:MouseEvent|TouchEvent) {
    if ( !mouseDown ) return
    if ( !currentPoint ) return
    
    const { x, y } = getTranslatedCordsFromEvent(e)
    
    if ( currentPoint.x !== 0 && currentPoint.x !== width ) currentPoint.x =x
    currentPoint.y =y

    if ( currentPoint.x < currentPointMinX ) currentPoint.x =currentPointMinX
    if ( currentPoint.x > currentPointMaxX ) currentPoint.x =currentPointMaxX

    if ( currentPoint.y < 0 ) currentPoint.y =0
    if ( currentPoint.y > height ) currentPoint.y =height

    curvePoints =curvePoints
  }


  // TODO instead of converting to number[] and then flipping the array
  // i should first flip the points and then convert to number[]
  function pointsToFloat32(points:Point[],width:number,height:number) {
    const arr:number[] =[]
    points.reduce((prev,curr) => {
      const angle =Math.atan2(curr.y -prev.y, curr.x -prev.x)
      
      for ( let x =prev.x; x < curr.x; x++ ) {
        const deltaX =curr.x -x
        const deltaY =(deltaX * Math.sin(angle)) /Math.cos(angle)
        arr.push(curr.y -deltaY)
      }

      return curr
    })


    // TODO fix this transformation mess
    const curve =arr.map(i => (height -i) /height)
    const curveLeft =[...curve.reverse()]
    curveLeft.pop()
    const curveRight =[...curve.map(i => -i).reverse()]
    curveRight.shift()

    const dblCurve =[...curveLeft,...curveRight].map(i => -i)

    debugCurve =linegenerator(dblCurve.map((y,x) => ({x,y}))) || ""

    return new Float32Array(dblCurve)
  }

  function handleToggleButton(e:CustomEvent) {
    const { sequence =[] } =musicPlayer.currentPreset
    const active =e.detail as boolean
    
    if ( active ) sequence?.push("waveshaper")
    else sequence?.splice(sequence.indexOf("waveshaper"),1)

    musicPlayer.loadEffectChain({
      ...musicPlayer.currentPreset ,sequence,
      waveshaper: { dry, wet }
    })
  }

  // TODO remove debug line
  // TODO add swtich component for symettic / asymetric curve
  // TODO add select component for default curve shapes
  // TODO mobile accesibility

  // TODO SUGGESTION add vital like gradient on the path element

</script>

<svelte:window
  on:mouseup={handleGrabEnd}
  on:resize={onWinResize}/>

<EffectTemplate {color} bind:active on:change={handleToggleButton} effectName="Waveshaper">
  <div
    bind:this={curveMonitor}
    on:dblclick={handleDblClick}
    on:mousedown={handleGrabStart}
    on:mousemove={handleGrab}
    class="curve-monitor bg-neutral-500 w-40 h-40">
    
    <svg fill="none"
      class="w-full h-full"
      viewBox="0 0 {width} {height}">

      {#each curvePoints as point}
        <circle cx={point.x} cy={point.y} r=1 fill={color} />
      {/each}
      <path d={svgLine} stroke-width=1 stroke={color} stroke-linejoin="round" />
    </svg>
  </div>

  <!-- <div class="w-52 h-52">
    <svg
      class="w-full h-full"
      viewBox="0 0 100 100">
      <path fill="none" stroke={color} d={debugCurve} />
    </svg>
  </div> -->

  <Knob
    defaultValue={0.8}
    min={0} max={1} step={0.02}
    label="dry" {color}
    bind:value={dry}
    on:change={e => active && musicPlayer.changeEffectParam({waveshaper:{dry:e.detail}})} />

  <Knob
    defaultValue={0.2}
    min={0} max={1} step={0.02}
    label="wet" {color}
    bind:value={wet}
    on:change={e => active && musicPlayer.changeEffectParam({waveshaper:{wet:e.detail}})} />
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
