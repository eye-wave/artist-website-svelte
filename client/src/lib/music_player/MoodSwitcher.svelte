<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { PRESET_NAMES, type T_PRESET_NAMES } from "./enums"
  import { slide } from "svelte/transition"
  import Angery from "../icons/Angery.svelte"
  import Fuwa from "../icons/Fuwa.svelte"
  import Happy from "../icons/Happy.svelte"
  import Sad from "../icons/Sad.svelte"

  export let currentMood:T_PRESET_NAMES =PRESET_NAMES.NORMAL

  const dispatch =createEventDispatcher<{change:T_PRESET_NAMES}>()
  let hover =false

  function change(item:T_PRESET_NAMES) {
    currentMood =item
    dispatch("change", currentMood)
  }

</script>


<div
  on:mouseover={() => hover =true}
  on:focus={() => hover =true}
  on:mouseleave={() => hover =false}
  class="switcher flex-shrink-0">
  
  {#if currentMood === PRESET_NAMES.ANGRY}
    <Angery />
  {:else if currentMood === PRESET_NAMES.HAPPY}
    <Fuwa />
  {:else if currentMood === PRESET_NAMES.NORMAL}
    <Happy />
  {:else if currentMood === PRESET_NAMES.SAD}
    <Sad />
  {/if}

  {#if hover}
    <div class="popup" class:hover >
      <div transition:slide on:click={() => change(PRESET_NAMES.NORMAL)}> <Happy /> </div>
      <div transition:slide on:click={() => change(PRESET_NAMES.SAD)}> <Sad /> </div>
      <div transition:slide on:click={() => change(PRESET_NAMES.ANGRY)}> <Angery /> </div>
      <div transition:slide on:click={() => change(PRESET_NAMES.HAPPY)}> <Fuwa /> </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .switcher {
    position: relative;
    @apply w-9;
  }

  .popup {
    @apply w-12 absolute bottom-0 -translate-y-14 -translate-x-2;
    opacity: 0;
    transition: opacity 200ms linear;
    @apply scale-90;

    &.hover { @apply opacity-100 scale-105 }
    &>div { @apply w-full h-full rounded-full }
  }
</style>