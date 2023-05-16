<script lang="ts">
  export let caption = ""
  export let inputElement: HTMLInputElement | undefined = undefined
  export let name: string | undefined = undefined
  export let placeholder = ""
  export let value = ""
</script>

{#if caption}
  <label for={name}>{caption}</label>
{/if}

<div class="mb-2 flex items-center gap-2 rounded-md bg-neutral-800 px-2">
  <slot />
  <input
    {name}
    {placeholder}
    type="text"
    bind:this={inputElement}
    bind:value
    autocomplete="off"
    class={$$props.class}
    on:change
    on:input
    on:keydown
    on:keydown={e => e.key === "Enter" && e.preventDefault()}
  />
</div>

<style lang="postcss">
  input {
    @apply w-full bg-transparent p-2;
    &:focus {
      outline: none;
    }
  }

  div:focus-within {
    box-shadow: 0 0 5px #ffffff40;
  }
</style>
