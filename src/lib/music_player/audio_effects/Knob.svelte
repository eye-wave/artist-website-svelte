<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { getCoordinatesFromEvent } from "src/utils/mouseEvent"

  export let color = "#7469ff"
  export let defaultValue = 0.5
  export let knobAngle = 35
  export let knobSpeed = 1
  export let label = ""
  export let max = 1
  export let min = 0
  export let step = 0.02
  export let value = defaultValue

  const dispatch = createEventDispatcher<{ change: number }>()

  $: knobRange = 360 - knobAngle * 2
  $: angle = ((value - min) / (max - min)) * knobRange
  $: valueText = value.toFixed(1)

  let startX = 0
  let startValue = -1
  let mouseDown = false

  function onDragStart(e: MouseEvent | TouchEvent) {
    mouseDown = true
    const { x } = getCoordinatesFromEvent(e)

    startX = x
    startValue = value
  }

  function onDragEnd() {
    if (!mouseDown) return
    mouseDown = false
    if (startValue !== value) dispatch("change", value)
  }

  function onDrag(e: MouseEvent | TouchEvent) {
    if (!mouseDown) return
    const { x } = getCoordinatesFromEvent(e)
    const deltaX = x - startX

    let val = deltaX
    val = (val / 100) * max * knobSpeed

    value = startValue + val
    if (value > max) value = max
    if (value < min) value = min

    value = Math.floor(value / step) * step
  }

  function onDblClick() {
    if (defaultValue === value) return

    value = defaultValue
    dispatch("change", value)
  }
</script>

<svelte:window on:mouseup={onDragEnd} on:touchend={onDragEnd} on:mousemove={onDrag} on:touchmove={onDrag} />

<div
  class="w-16 select-none text-center text-white{$$props.class ? ' ' + $$props.class : ''}"
  on:contextmenu|preventDefault
  on:dblclick={onDblClick}
  on:mousedown={onDragStart}
  on:touchstart={onDragStart}
>
  <div style="--v:{angle}deg;--a:{knobAngle + 180}deg;--c:{color}" class="progress" />
  {#if label}
    <span class="font-bold">{label}</span>
  {/if}
  <span class="text-xs">{valueText}</span>
</div>

<style lang="postcss">
  .progress {
    @apply h-14 w-14;
    @apply rounded-full;
    transform: rotate(var(--a));
    background: radial-gradient(#666 50%, transparent 51%), conic-gradient(transparent 0deg var(--v), #555 var(--v) 360deg),
      conic-gradient(var(--c) 0deg, var(--c) 360deg);
  }
</style>
