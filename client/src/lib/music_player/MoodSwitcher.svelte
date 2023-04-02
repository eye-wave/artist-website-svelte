<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { PRESET_NAMES, type T_PRESET_NAMES } from "./enums"
  import { slide } from "svelte/transition"
  import Angery from "../icons/Angery.svg?component"
  import Fuwa from "../icons/Fuwa.svg?component"
  import Happy from "../icons/Happy.svg?component"
  import Sad from "../icons/Sad.svg?component"

  export let currentMood:T_PRESET_NAMES =PRESET_NAMES.NORMAL

  const dispatch =createEventDispatcher<{change:T_PRESET_NAMES}>()
  const presetMap =new Map<T_PRESET_NAMES,typeof Happy>([
    [PRESET_NAMES.NORMAL,Happy],
    [PRESET_NAMES.SAD,Sad],
    [PRESET_NAMES.ANGRY,Angery],
    [PRESET_NAMES.HAPPY,Fuwa],
  ])

  let currentComponent:(typeof Happy) =Happy
  let hover =false

  function change(name:T_PRESET_NAMES) {
    currentMood =name
    currentComponent =presetMap.get(name) || Happy

    dispatch("change", currentMood)
  }

</script>

<div
  on:mouseover={() => hover =true}
  on:focus={() => hover =true}
  on:mouseleave={() => hover =false}
  class="switcher flex-shrink-0">
  
  <svelte:component this={currentComponent} />

  {#if hover}
    <div class="popup" class:hover >
      {#each Array.from(presetMap.entries()) as [name,Component]}
        <div transition:slide on:click={() => change(name)}> <Component /> </div>      
      {/each}
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