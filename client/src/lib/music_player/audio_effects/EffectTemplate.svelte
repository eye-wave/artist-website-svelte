<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let active =false
  export let color ="#7469ff"
  export let effectName:string
  export let enableToggle =true

  const dispatch =createEventDispatcher<{change: boolean}>()
  function handleToggle() {
    active =!active
    dispatch("change",active)
  }

  // TODO accesibility on toggle

</script>

<div class="p-4 bg-neutral-700">
  <span class="text-white font-bold">{effectName}</span>
  <div class="flex gap-2 items-start flex-wrap">
    <slot />

    {#if enableToggle}
      <button
        on:click={handleToggle}
        class:bg-neutral-500={!active}
        style:background={active ? color : ""}
        class="cursor-pointer w-6 h-6 rounded-full" />
    {/if}
  </div>
</div>
