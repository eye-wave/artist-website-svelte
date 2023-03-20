<script lang="ts">
  import Card from "src/lib/Card.svelte"

  export let data

  const { songs } =data
  const playlist =songs.map(song => song.audioId)

</script>

<svelte:head>
  <title>Demo songs</title>
</svelte:head>

<main class="flex flex-wrap gap-3 justify-center">
  {#each songs as song}
    <Card {playlist} {...song} />
  {/each}
</main>

<style lang="postcss">

</style>
