<script lang="ts">
  import { artistMap } from "~/stores/artists"
  import { debounce } from "~/utils/debounce"
  import { page } from "$app/stores"
  import GridIcon from "virtual:icons/ion/grid"
  import Head from "$lib/Head.svelte"
  import Input from "~/lib/inputs/Input.svelte"
  import ListIcon from "virtual:icons/ci/hamburger-lg"
  import Noscript from "$lib/Noscript.svelte"
  import SongCard from "./SongCard.svelte"
  import SongItem from "./SongItem.svelte"

  export let data

  const { songs, artists } = data

  let displayAsGrid = $page.url.searchParams.get("view") !== "list"
  let filteredSongs = songs

  const playlist = songs.map(song => song.audioId)
  const testInputSongs = new Map(
    songs.map(song => {
      const testInput = ""
        .concat(song.metadata.artists.join(""))
        .concat(song.metadata.tags.join(""))
        .concat(song.metadata.title)
        .toLowerCase()

      return [song.audioId, testInput]
    }),
  )

  artists.forEach(a => artistMap.set(a.name, a))

  // TODO create playlist store, that changes based on filtered songs

  let lastSearched = ""
  let searchInputValue = ""

  function onSearch() {
    const keywords = searchInputValue.trim().toLowerCase().split(" ")
    if (keywords.length < 1) return

    filteredSongs = songs.filter(song => {
      const testSong = testInputSongs.get(song.audioId)
      return keywords.every(word => testSong?.includes(word))
    })
  }

  const debouncedOnSearch = debounce(onSearch, 180)

  $: {
    if (searchInputValue.trim() !== lastSearched) {
      lastSearched = searchInputValue.trim()
      debouncedOnSearch()
    }
  }
</script>

<Head title="Demo Songs" description="Listen to project that propably won't be finished ever." />
<Noscript>Some features may not be available without scripts. Enable Javascript for full experience.</Noscript>

<div class="mx-auto w-full max-w-3xl">
  <Input placeholder="Search for songs . . ." bind:value={searchInputValue} />
</div>

<div class="mx-auto my-5 flex w-fit gap-5">
  <a
    href="{$page.url.pathname}?view=grid"
    on:click={() => (displayAsGrid = true)}
    class:bg-primary-500={displayAsGrid}
    class="rounded-full bg-neutral-900 px-8 py-2 text-3xl"
    title="grid view"
  >
    <GridIcon />
  </a>
  <a
    href="{$page.url.pathname}?view=list"
    on:click={() => (displayAsGrid = false)}
    class:bg-primary-500={!displayAsGrid}
    class="rounded-full bg-neutral-900 px-8 py-2 text-3xl"
    title="list view"
  >
    <ListIcon />
  </a>
</div>

{#if searchInputValue.length > 0}
  <p class="mb-4 text-center">Showing {filteredSongs.length} results.</p>
{/if}

<section class:flex-col={!displayAsGrid} class:flex-wrap={displayAsGrid} class="flex justify-evenly gap-5 pb-20">
  {#each filteredSongs as song (song.audioId)}
    <svelte:component this={displayAsGrid ? SongCard : SongItem} {playlist} {...song} />
  {/each}
</section>

<style lang="postcss">
  section {
    min-height: 400px;
  }
</style>
