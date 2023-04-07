<script lang="ts">
  import Head from "$lib/Head.svelte"
  import Noscript from "$lib/Noscript.svelte"
  import { artistMap } from "src/stores/artists"
  import SongCard from "./SongCard.svelte"

  export let data

  const { songs, artists } =data
  const playlist =songs.map(song => song.audioId)

  artists.forEach(a => artistMap.set( a.name, a ))
  
</script>

<Head title="Demo Songs"></Head>

<Noscript>
  Some features may not be available without scripts.
  Enable Javascript for full experience.
</Noscript>

<main>
  <section class="text-xl px-[10vmin] text-center select-none my-96 font-semibold text-neutral-400">
    <p class="mx-auto max-w-4xl">
      Ooops, looks like my precious songs have been exposed. <br>
      Well... now you might as well check them out. <span class="font-black text-xl text-neutral-600">Right?</span> <br>
      Enough from me. Have fun messing around.
    </p>
  </section>

  <section class="flex flex-wrap gap-10 justify-center px-10">
    {#each songs as song}
      <SongCard {playlist} {...song} />
    {/each}
  </section>
</main>
