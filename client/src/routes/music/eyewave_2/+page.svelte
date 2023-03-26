<script lang="ts">
  import Card from "src/lib/Card.svelte"
  import type { SongMetadata } from "src/lib/music_player/queue"
  import Noscript from "src/lib/Noscript.svelte"

  export let data

  const { songs } =data
  const playlist =songs.map(song => song.audioId)

</script>

<svelte:head>
  <title>Demo songs</title>
</svelte:head>

<Noscript>Enable Javascript for the best experience on this page</Noscript>

<main>
  <ul class="flex flex-wrap gap-10 justify-center px-10">
    {#each songs as song}
      <Card {playlist} {...song} />
    {/each}
  </ul>
</main>
