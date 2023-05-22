<script lang="ts">
  export let dot = true
  export let url: string | undefined = undefined

  $: target = url ? "_blank" : undefined
</script>

<span class="flex w-fit items-center gap-1 bg-black/50 px-2 rounded-full{$$props.class ? ' ' + $$props.class : ''}">
  {#if dot}
    <div class="h-2 w-2 rounded-full bg-current" />
  {/if}
  <svelte:element this={url ? "a" : "span"} href={url} {target} class="text-sm">
    <slot>#Tag</slot>
  </svelte:element>
</span>
