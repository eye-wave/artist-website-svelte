<script lang="ts">
  import Head from "$lib/Head.svelte"
  import Noscript from "$lib/Noscript.svelte"
  import { artistMap } from "src/stores/artists"
  import SongCard from "./SongCard.svelte"
  import Search from "$lib/inputs/TagInput.svelte"
  import { debounce } from "src/utils/debounce"
  import type { ModifiedSongData } from "./+page"

  export let data

  const { songs, artists } = data
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
  let searchedTags = new Set<string>()

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

{#if searchInputValue.length + searchedTags.size > 0}
  <span class="mb-4">Showing {filteredSongs.length} results.</span>
{/if}

<section class="flex flex-wrap justify-center gap-10 px-10 pb-20">
  {#each filteredSongs as song (song.audioId)}
    <SongCard {playlist} {...song} />
  {/each}
</section>

<style lang="postcss">
  section {
    min-height: 400px;
  }
</style>
