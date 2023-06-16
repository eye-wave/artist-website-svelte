<script lang="ts">
  let content = "Put your description here."

  const themeColor = "#40209F"

  export let title = "index.html"
  export { content as description }
  export let image = "/favicon.svg"
  export let imageWidth = 600
  export let imageHeight = 600
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta property="twitter:title" content={title} />

  <meta name="description" {content} />
  <meta property="og:description" {content} />
  <meta property="twitter:description" {content} />

  {#if image}
    <meta property="twitter:image" content={image} />
    <meta property="og:image" content={image} />
    <meta property="og:image:width" content={imageWidth} />
    <meta property="og:image:height" content={imageHeight} />
    <meta property="og:image:type" content="image/jpg" />
  {/if}

  <meta property="og:locale" content="en_US" />
  <meta name="theme-color" content={themeColor} />
  <slot />
</svelte:head>
