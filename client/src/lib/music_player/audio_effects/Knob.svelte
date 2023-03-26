<script lang="ts">
  import { getCoordinatesFromEvent } from "src/utils/mouseEvent"
  import { createEventDispatcher } from "svelte"

  const dispatch =createEventDispatcher<{change: number}>()

  let startX =0
  let startY =0
  let startValue =-1
  let mouseDown =false

  export let defaultValue =0.5
  export let value =defaultValue
  export let max =1
  export let min =0
  export let step =0.02
  export let color ="#7469ff"
  export let label =""

  export let knobAngle =35
  export let knobSpeed =1
  $: knobRange =360 -knobAngle *2
  $: angle =(value -min) / (max -min) *knobRange
  $: valueText =value.toFixed(1)

  function onDragStart(e:MouseEvent|TouchEvent) {
    mouseDown =true

    const { x,y } =getCoordinatesFromEvent(e)
    
    startX =x
    startY =y
    startValue =value
  }

  function onDragEnd(e:MouseEvent|TouchEvent) {
    if ( !mouseDown ) return
    mouseDown =false
    if ( startValue !== value ) dispatch("change",value)
  }

  function onDrag(e:MouseEvent|TouchEvent) {
    if ( !mouseDown ) return
    const { x } =getCoordinatesFromEvent(e)
    let deltaX =x -startX

    let val =deltaX
    val =val /100 *max *knobSpeed

    value =startValue +val
    if ( value > max ) value =max
    if ( value < min ) value =min

    value =Math.floor(value /step) *step
  }


  function onDblClick() {
    if ( defaultValue === value ) return
    
    value =defaultValue
    dispatch("change",value)
  }

  
</script>


<svelte:window
  on:mouseup={onDragEnd}
  on:touchend={onDragEnd}
  on:mousemove={onDrag}
  on:touchmove={onDrag}
/>


<div
  class="select-none text-center w-16 text-white{$$props.class ? " "+$$props.class : ""}"
  on:dblclick={onDblClick}
  on:mousedown={onDragStart}
  on:touchstart={onDragStart}>
  <div
    style="--v:{angle}deg;--a:{knobAngle +180}deg;--c:{color}"
    class="progress">
  </div>
  {#if label}
    <span class="font-bold">{label}</span>
  {/if}
  <span class="text-xs">{valueText}</span>
</div>

<style lang="postcss">
  .progress {
    @apply w-14 h-14;
    @apply rounded-full;
    transform: rotate(var(--a));
    background: 
      radial-gradient(#666 50%, transparent 51%),
      conic-gradient(transparent 0deg var(--v), #555 var(--v) 360deg),
      conic-gradient(var(--c) 0deg, var(--c) 360deg);
  }

</style>
