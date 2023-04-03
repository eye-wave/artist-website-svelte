<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import { getCoordinatesFromEvent } from "src/utils/mouseEvent"

  export let max =100
  export let min =0
  export let value =0
  export let vertical =false

  const dispatch =createEventDispatcher<{change:number}>()
  const margin =12

  let div:HTMLDivElement
  let domRect:DOMRect
  let mouseDown =false
  let percentValue =0

  $: pixelWidth =vertical ?
    ((domRect?.height || margin *2) -margin *2 -10) :
    ((domRect?.width || margin *2) -margin *2 -10)
  $: pixelValue =mouseDown ? 
    percentValue *pixelWidth :
    ( value -min ) / ( max - min ) *pixelWidth

  function handleMouseDown(e:MouseEvent) {
    mouseDown =true
    handleMouseMove(e)
  }
  
  function handleMouseMove(e:MouseEvent) {
    if ( !mouseDown ) return

    const { x, y } =getCoordinatesFromEvent(e)
    const val =vertical ?
      y -domRect.top -margin :
      x -domRect.left -margin
    
    percentValue =val / pixelWidth
    if ( percentValue < 0 ) percentValue =0
    if ( percentValue > 1 ) percentValue =1
  }
  
  function handleMouseUp() {
    if ( !mouseDown ) return
    mouseDown =false
    dispatch("change",percentValue)
    value =percentValue *(max -min) +min
  }


  function onResize() { domRect =div.getBoundingClientRect() }
  onMount(onResize)
  
</script>

<svelte:window
  on:resize={onResize}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp} />

<div
  on:mousedown={handleMouseDown}
  bind:this={div}
  class:vertical
  class="slider-container">
  
  <div class="slider-track" class:vertical>
    <div 
      style:transform="translate({vertical ? 0 : pixelValue}px,{vertical ? pixelValue : 0}px)"
      class="slider-thumb"
      class:vertical/>
  </div>
</div>

<style lang="postcss">
  
  .slider {
    &-container {
      @apply relative m-2 p-3 w-full h-10;
      @apply flex items-center;

      * {
        @apply relative rounded-full;
        @apply flex items-center;
      }
    }

    &-track { @apply w-full h-2 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 }
    &-thumb { @apply w-3 h-6 bg-gradient-to-b from-primary-300 to-primary-500 shadow-md }
  }

  .vertical { @apply justify-center items-start }
  .slider-container.vertical { @apply h-96 w-10 }
  .slider-track.vertical { @apply h-full w-2 bg-gradient-to-b }
  .slider-thumb.vertical { @apply h-3 w-6 flex-shrink-0 bg-gradient-to-r }
  
</style>