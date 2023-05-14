<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let active = false
  export let color = "#7469ff"
  export let effectName: string
  export let enableToggle = true

  const dispatch = createEventDispatcher<{ change: boolean }>()
  function handleToggle() {
    active = !active
    dispatch("change", active)
  }
</script>

<div class="relative my-1 rounded-md bg-neutral-900 p-4">
  <span class="font-bold text-white">{effectName}</span>
  <div class="flex flex-wrap items-start justify-evenly">
    <slot />
  </div>
  {#if enableToggle}
    <button
      on:click={handleToggle}
      class:bg-neutral-500={!active}
      style:background={active ? color : ""}
      class="absolute right-3 top-3 h-6 w-6 cursor-pointer rounded-full"
    />
  {/if}
</div>
