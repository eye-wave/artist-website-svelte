<script lang="ts">
  let content = "Put your description here."

  export let title = "index.html"
  export { content as description }
  export let image: string | undefined = undefined
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" {content} />
  {#if image}
    <meta property="og:image" content={image} />
    <meta name="twitter:image" content={image} />
  {/if}
  <slot />
</svelte:head>
