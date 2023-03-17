<script lang="ts">
  import { musicPlayer } from "src/lib/MusicPlayer.svelte"
  import { getCoordinatesFromEvent } from "src/utils/mouseEvent";
  import { onMount } from "svelte"
  // import type { ReverbNode, ReverbOptions } from "../reverb"
  import Knob from "./Knob.svelte"
  export let active =false
  export let color ="#7469ff"
  export let width =360
  export let height =220

  const filters =Array.from({ length:3 }).map((_,i) => {
    return {
      frequency: i * 40 +20,
      gain: 1,
      Q: 1,
      type: "peaking"
    }
  })

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

  function handleGrabStart(e:MouseEvent|TouchEvent) {
    const { x,y } =getTranslatedCordsFromEvent(e)


  }
  function handleGrab(e:MouseEvent|TouchEvent) {
    const { x,y } =getTranslatedCordsFromEvent(e)


  }
  function handleGrabEnd(e:MouseEvent|TouchEvent) {
    const { x,y } =getTranslatedCordsFromEvent(e)


  }

</script>

<svelte:window 
  on:mouseup={handleGrabEnd}
  on:mousemove={handleGrab}
  on:resize={onWinResize}/>

<div class="flex gap-2 p-4 bg-neutral-700">
  <span class="text-white font-bold">EQ</span>

  <div
    bind:this={curveMonitor}
    on:mousedown={handleGrabStart}
    class="curve-monitor bg-neutral-500 w-fit">
    <svg fill="none"
      class="w-full h-full" {width} {height}
      viewBox="0 0 {width} {height}">
      
      {#each filters as filter}
        {@const r =10}
        
        <circle cy={height /2} cx={filter.frequency +r} {r} fill="#000" />
        <text y={height /2} x={filter.frequency} {r} fill="#fff">hi</text>

      {/each}
    </svg>
  </div>

  <div
    on:click={() => active =!active}
    class:bg-neutral-500={!active}
    style:background={active ? color : ""}
    class="cursor-pointer w-6 h-6 rounded-full" />
</div>

<style>
  .curve-monitor {
    background-image: 
      linear-gradient(45deg, #333 25%, transparent 25.1%, transparent 74.9%, #333 75%),
      linear-gradient(45deg, #333 25%, #444 25.1%, #444 74.9%, #333 75%);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
  }
</style>
