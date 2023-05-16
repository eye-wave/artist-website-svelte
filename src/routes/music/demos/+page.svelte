<script lang="ts">
  import { artistMap } from "~/stores/artists"
  import { debounce } from "~/utils/debounce"
  import GridIcon from "virtual:icons/ion/grid"
  import Head from "$lib/Head.svelte"
  import ListIcon from "virtual:icons/ci/hamburger-lg"
  import Noscript from "$lib/Noscript.svelte"
  import Search from "$lib/inputs/TagInput.svelte"
  import SongCard from "./SongCard.svelte"
  import SongItem from "./SongItem.svelte"
  import type { ModifiedSongData } from "./+page"
  import { page } from "$app/stores"

  export let data

  const { songs, artists, gridView } = data

  let displayAsGrid = gridView
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
  let searchedTags = new Set<string>()
  let searchInputValue = ""

  function filterByText(songArray: ModifiedSongData[]) {
    const toLower = searchInputValue.trim().toLowerCase()
    return songArray.filter(song => testInputSongs.get(song.audioId)?.includes(toLower))
  }

  function filterByTags(songArray: ModifiedSongData[], tags: string[]) {
    return songArray.filter(song => tags.every(tag => testInputSongs.get(song.audioId)?.includes(tag)))
  }

  function onSearch() {
    let filtered = songs

    if (searchInputValue) filtered = filterByText(filtered)
    if (searchedTags.size > 0) filtered = filterByTags(filtered, [...searchedTags])

    filteredSongs = filtered
  }

  const debouncedOnSearch = debounce(onSearch, 180)

  $: {
    if (searchInputValue.trim() !== lastSearched || searchedTags) {
      lastSearched = searchInputValue.trim()
      debouncedOnSearch()
    }
  }
</script>

<Head title="Demo Songs" description="Listen to project that propably won't be finished ever." />
<Noscript>Some features may not be available without scripts. Enable Javascript for full experience.</Noscript>

<Search class="mx-auto" bind:tags={searchedTags} bind:value={searchInputValue} />

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

{#if searchInputValue.length + searchedTags.size > 0}
  <span class="mb-4">Showing {filteredSongs.length} results.</span>
{/if}

<section
  class:flex-col={!displayAsGrid}
  class:gap-3={!displayAsGrid}
  class:flex-wrap={displayAsGrid}
  class:gap-10={displayAsGrid}
  class:px-10={displayAsGrid}
  class="flex justify-center pb-20"
>
  {#each filteredSongs as song (song.audioId)}
    <svelte:component this={displayAsGrid ? SongCard : SongItem} {playlist} {...song} />
  {/each}
</section>

<style lang="postcss">
  section {
    min-height: 400px;
  }
</style>
