<script lang="ts">
  let content = "Put your description here."

  export let title = "index.html"
  export { content as description }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" {content} />
  <slot />
</svelte:head>
