<script lang="ts">
  let content = "Put your description here."
  import conf from "src/tailwind.config"

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const themeColor = conf.theme?.extend?.colors?.primary[500] ?? "#40209F"

  export let title = "index.html"
  export { content as description }
  export let image: string | undefined = undefined
  export let imageWidth: number | undefined = undefined
  export let imageHeight: number | undefined = undefined
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta name="description" {content} />
  <meta property="og:locale" content="en_UK" />
  <meta name="theme-color" content={themeColor} />
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
