<script lang="ts">
  import { PLAYER_STATE } from "$lib/music_player/enums"
  import Card from "$lib/Card.svelte"
  import LoadingIcon from "virtual:icons/line-md/loading-loop"
  import OpenIcon from "virtual:icons/material-symbols/open-in-new-rounded"
  import PauseIcon from "virtual:icons/mingcute/pause-circle-fill"
  import PlayIcon from "virtual:icons/material-symbols/play-circle-rounded"
  import Tag from "$lib/Tag.svelte"
  import SongWrapper from "./SongWrapper.svelte"
  import { isMusicPlayerInitialized } from "~/stores/isMusicPlayerInitialized"

  $: musicPlayer = $isMusicPlayerInitialized
  $: currentTrackStore = musicPlayer?.stores.currentTrackStore
  $: playerStateStore = musicPlayer?.stores.playerStateStore

  export let audioId: string
  export let playlist: string[]
  export let metadata: {
    title: string
    imageId: string
    timestamp: number
    genre: string
  }
</script>

<SongWrapper {audioId} {playlist} let:cardLoading let:handlePlayButton let:isJavascriptEnabled>
  <Card title={metadata.title} img={metadata.imageId}>
    <a aria-label="more info" class="absolute bottom-2 left-2 z-10" href="/song/{audioId}">
      <OpenIcon />
    </a>

    <Tag class="relative ml-4">{metadata.genre}</Tag>

    {#if isJavascriptEnabled}
      <button class="absolute bottom-1 right-1 text-6xl text-primary-400" aria-label="play" on:click={handlePlayButton}>
        {#if audioId === $currentTrackStore?.audioId && $playerStateStore === PLAYER_STATE.PLAYING}
          <PauseIcon />
        {:else if cardLoading}
          <LoadingIcon />
        {:else}
          <PlayIcon />
        {/if}
      </button>
    {/if}
  </Card>
</SongWrapper>
