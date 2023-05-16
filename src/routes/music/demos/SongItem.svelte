<script lang="ts">
  import { formatUnixDate } from "~/utils/time"
  import { isMusicPlayerInitialized } from "~/stores/isMusicPlayerInitialized"
  import { PLAYER_STATE } from "$lib/music_player/enums"
  import { trimText } from "~/utils/text"
  import { viewport } from "~/actions/viewport"
  import LoadingIcon from "virtual:icons/line-md/loading-loop"
  import OpenIcon from "virtual:icons/material-symbols/open-in-new-rounded"
  import PauseIcon from "virtual:icons/mingcute/pause-circle-fill"
  import PlayIcon from "virtual:icons/material-symbols/play-circle-rounded"
  import SongWrapper from "./SongWrapper.svelte"
  import Tag from "$lib/Tag.svelte"

  export let audioId: string
  export let playlist: string[]
  export let metadata: {
    title: string
    imageId: string
    artists: string[]
    timestamp: number
    genre: string
  }

  $: musicPlayer = $isMusicPlayerInitialized
  $: currentTrackStore = musicPlayer?.stores.currentTrackStore
  $: playerStateStore = musicPlayer?.stores.playerStateStore

  let enteredViewport = false
  let windowWidth = 550
</script>

<svelte:window bind:innerWidth={windowWidth} />

<SongWrapper {audioId} {playlist} let:cardLoading let:handlePlayButton let:isJavascriptEnabled>
  <div class="flex gap-3 bg-neutral-900 p-2" use:viewport on:enterViewport={() => (enteredViewport = true)}>
    <div class="aspect-square w-16 flex-shrink-0 overflow-hidden rounded-sm bg-black sm:w-24">
      {#if enteredViewport}
        <picture>
          <source media="(min-width:640px)" srcset="/api/storage/file/{metadata.imageId}?width=96&height=96" />
          <img draggable="false" src="/api/storage/file/{metadata.imageId}?width=64&height=64" alt="" />
        </picture>
      {:else}
        <noscript>
          <picture>
            <source media="(min-width:640px)" srcset="/api/storage/file/{metadata.imageId}?width=96&height=96" />
            <img draggable="false" src="/api/storage/file/{metadata.imageId}?width=64&height=64" alt="" />
          </picture>
        </noscript>
      {/if}
    </div>

    <div class="flex flex-1 flex-col gap-2 overflow-hidden">
      <a class="select-none font-title text-sm md:text-xl" href="/song/{audioId}" aria-label="more info">
        {#if windowWidth > 400}
          <OpenIcon class="inline sm:text-sm" />
        {/if}
        {trimText(metadata.title, windowWidth / 22)}
      </a>
      {#if windowWidth > 400}
        <Tag>{metadata.genre}</Tag>
      {/if}

      {#if windowWidth > 550}
        <ul class="flex justify-center gap-2">
          {#each metadata.artists.slice(0, Math.floor(windowWidth / 180)) as artist}
            <Tag dot={false}>{artist}</Tag>
          {/each}
          {#if metadata.artists.length > Math.floor(windowWidth / 180)}
            <Tag dot={false}>...</Tag>
          {/if}
        </ul>
      {/if}
    </div>

    <div class="relative flex min-w-[40px] flex-col items-end justify-between">
      {#if windowWidth > 400}
        <p class="text-sm text-white/40">{formatUnixDate(metadata.timestamp, true)}</p>
      {/if}

      {#if isJavascriptEnabled}
        <button class="absolute bottom-1 right-1 text-3xl text-primary-400" aria-label="play" on:click={handlePlayButton}>
          {#if audioId === $currentTrackStore?.audioId && $playerStateStore === PLAYER_STATE.PLAYING}
            <PauseIcon />
          {:else if cardLoading}
            <LoadingIcon />
          {:else}
            <PlayIcon />
          {/if}
        </button>
      {/if}
    </div>
  </div>
</SongWrapper>
