<script lang="ts">
  export let active =false
  export let color ="#7469ff"

</script>


<div class="bg-neutral-700 font-bold">
  <div class="flex justify-between">
    <span class="p-2 text-white ">
      <slot name="label" />
    </span>
    <div class="bg-neutral-800 text-neutral-500 rounded-b-md w-10 text-center">...</div>
  </div>
  <div class="flex gap-2 p-4">
    <slot />
    <div
      on:click={() => active =!active}
      class:bg-neutral-500={!active}
      style:background={active ? color : ""}
      class="cursor-pointer w-6 h-6 rounded-full" />
  </div>
</div>
