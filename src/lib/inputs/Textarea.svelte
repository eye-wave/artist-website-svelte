<script lang="ts">
  export let caption = ""
  export let name: string | undefined = undefined
  export let placeholder = ""
  export let textAreaElement: HTMLTextAreaElement | undefined = undefined
  export let value = ""
</script>

{#if caption}
  <label for={name}>{caption}</label>
{/if}

<textarea
  {name}
  {placeholder}
  bind:this={textAreaElement}
  bind:value
  class="flex resize-none items-center gap-2 rounded-md bg-neutral-800 p-3"
  on:change
  on:input
  on:keydown
/>

<style lang="postcss">
  textarea {
    min-height: 160px;

    &:focus {
      outline: none;
    }

    &:focus-within {
      box-shadow: 0 0 5px #ffffff40;
    }
  }
</style>
