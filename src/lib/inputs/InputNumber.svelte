<script lang="ts">
  export let value = 0
  export let name: string | undefined = undefined
  export let caption = ""
  export let placeholder = ""
  export let min = 0
  export let max = 10
  export let inputElement: HTMLInputElement | undefined = undefined
</script>

{#if caption}
  <label for={name}>{caption}</label>
{/if}

<div class="mb-2 flex items-center gap-2 rounded-md bg-neutral-800 px-2">
  <slot />
  <input
    {name}
    {placeholder}
    {min}
    {max}
    type="number"
    bind:this={inputElement}
    bind:value
    class="w-full appearance-none bg-transparent p-2"
    on:change
    on:input
    on:keydown
  />
</div>

<style lang="postcss">
  input:focus {
    outline: none;
  }

  div:focus-within {
    box-shadow: 0 0 5px #ffffff40;
  }
</style>
