<script lang="ts">
  import SongCard from "src/lib/SongCard.svelte"
  import Head from "src/lib/Head.svelte"
  import Noscript from "src/lib/Noscript.svelte"

  export let data

  const { songs } =data
  const playlist =songs.map(song => song.audioId)

</script>

<Head title="Demo Songs"></Head>

<Noscript>Enable Javascript for the best experience on this page</Noscript>

<main>
  <section class="text-xl px-[10vmin] text-center select-none my-20">
    <p>Oh so you found my Garbage Disposal</p>
    <p>Well... here you can find songs that didn't fit on main, early versions of released songs, and shitposts.</p>
    <p>Don't even bother opening soundcloud, this music player has all you need. and more</p>
  </section>

  <section class="flex flex-wrap gap-10 justify-center px-10">
    {#each songs as song}
      <SongCard {playlist} {...song} />
    {/each}
  </section>
</main>
