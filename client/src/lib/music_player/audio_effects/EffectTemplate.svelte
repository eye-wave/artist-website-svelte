<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let enableToggle =true
  export let effectName:string
  export let active =false
  export let color ="#7469ff"

  const dispatch =createEventDispatcher<{change: boolean}>()
  function handleToggle() {
    active =!active
    dispatch("change",active)
  }

  // TODO accesibility on toggle

</script>

<div class="p-4 bg-neutral-700">
  <span class="text-white font-bold">{effectName}</span>

  <div class="flex gap-2 ">
    <slot />

    {#if enableToggle}
      <div
        on:click={handleToggle}
        class:bg-neutral-500={!active}
        style:background={active ? color : ""}
        class="cursor-pointer w-6 h-6 rounded-full" />
    {/if}
  </div>
</div>
