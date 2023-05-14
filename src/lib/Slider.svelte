<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import { getCoordinatesFromEvent } from "src/utils/mouseEvent"

  export let max = 100
  export let min = 0
  export let value = 0
  export let vertical = false
  export let fixed = false
  export let maxSize = 9999

  const dispatch = createEventDispatcher<{ change: number }>()
  const margin = 12

  let div: HTMLDivElement
  let domRect: DOMRect
  let mouseDown = false
  let percentValue = 0

  // TODO fix slider on mobile devices

  $: pixelWidth = vertical
    ? (domRect?.height || margin * 2) - margin * 2 - 10
    : (domRect?.width || margin * 2) - margin * 2 - 10
  $: pixelValue = mouseDown ? percentValue * pixelWidth : ((value - min) / (max - min)) * pixelWidth

  function handleMouseDown(e: MouseEvent | PointerEvent) {
    mouseDown = true
    onResize()
    handleMouseMove(e)
  }

  function handleMouseMove(e: MouseEvent | PointerEvent) {
    if (!mouseDown) return

    const { x, y } = getCoordinatesFromEvent(e, fixed)
    const val = vertical ? y - domRect.y - margin - 6 : x - domRect.x - margin - 6

    percentValue = val / pixelWidth
    if (percentValue < 0) percentValue = 0
    if (percentValue > 1) percentValue = 1

    value = percentValue * (max - min) + min
  }

  function handleMouseUp() {
    if (!mouseDown) return
    mouseDown = false
    dispatch("change", percentValue)
    value = percentValue * (max - min) + min
  }

  function onResize() {
    domRect = div.getBoundingClientRect()
  }
  onMount(onResize)
</script>

<svelte:window
  on:resize={onResize}
  on:pointerup={handleMouseUp}
  on:pointermove={handleMouseMove}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
/>

<div
  on:dblclick
  on:mousedown={handleMouseDown}
  on:pointerdown={handleMouseDown}
  bind:this={div}
  class:vertical
  style="--max:{maxSize}px"
  class="slider-container"
>
  <div class="slider-track" class:vertical>
    <div
      style:transform="translate({vertical ? 0 : pixelValue}px,{vertical ? pixelValue : 0}px)"
      class="slider-thumb"
      class:vertical
    />
  </div>
</div>

<style lang="postcss">
  .slider {
    &-container {
      min-width: 4vmin;
      max-width: var(--max);
      @apply relative m-2 h-10 w-full p-3;
      @apply flex items-center;
      /* @apply bg-red-800; */

      * {
        @apply relative rounded-full;
        @apply flex items-center;
      }
    }

    &-track {
      @apply h-[2px] w-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600;
    }
    &-thumb {
      @apply h-3 w-3 bg-gradient-to-b from-primary-300 to-primary-500 shadow-md;
    }
  }

  .vertical {
    @apply items-start justify-center;
  }
  .slider-container.vertical {
    @apply h-96 w-10;
    max-width: max-content;
    max-height: var(--max);
  }
  .slider-track.vertical {
    @apply h-full w-[2px] bg-gradient-to-b;
  }
  .slider-thumb.vertical {
    @apply flex-shrink-0 bg-gradient-to-r;
  }
</style>
