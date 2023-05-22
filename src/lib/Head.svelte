<script lang="ts">
  let content = "Put your description here."

  export let title = "index.html"
  export { content as description }
  export let image: string | undefined = undefined
  export let imageWidth: number | undefined = undefined
  export let imageHeight: number | undefined = undefined
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" {content} />
  {#if image}
    <meta property="og:image" content={image} />
    <meta name="twitter:image" content={image} />
    {#if imageWidth}
      <meta property="og:image:width" content={`${imageWidth}`} />
    {/if}
    {#if imageHeight}
      <meta property="og:image:height" content={`${imageHeight}`} />
    {/if}
  {/if}
  <slot />
</svelte:head>
