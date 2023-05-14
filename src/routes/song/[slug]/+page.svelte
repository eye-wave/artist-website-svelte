<script lang="ts">
  import { fly } from "svelte/transition"
  import { formatUnixDate } from "src/utils/date"
  import { isMusicPlayerInitialized } from "src/stores/isMusicPlayerInitialized"
  import { onMount } from "svelte"
  import { parsePost } from "./parser"
  import { PLAYER_STATE } from "src/lib/music_player/enums"
  import ExitIcon from "virtual:icons/material-symbols/exit-to-app-rounded"
  import LoadingIcon from "virtual:icons/line-md/loading-loop"
  import PauseIcon from "virtual:icons/mingcute/pause-circle-fill"
  import PlayIcon from "virtual:icons/material-symbols/play-circle-rounded"
  import Tag from "$lib/Tag.svelte"
  import type { MusicPlayer } from "$lib/music_player"

  export let data

  let musicPlayer: MusicPlayer | undefined
  let pageLoading = false
  let windowWidth = 300

  const width = 800
  const height = 200

  $: musicPlayer = $isMusicPlayerInitialized
  $: playerStateStore = musicPlayer?.stores.playerStateStore
  $: currentTrackStore = musicPlayer?.stores.currentTrackStore
  $: song = data.song
  $: post = data.post
  $: waveform = data.waveform
  $: artists = data.artists

  async function handlePlayButton() {
    if (musicPlayer === undefined) {
      pageLoading = true
      const { musicPlayer: mplayer } = await import("$lib/music_player")
      isMusicPlayerInitialized.set(mplayer)
      musicPlayer = mplayer
    }

    if (!musicPlayer.isInitialized) {
      await musicPlayer.initialize()
    }

    if (musicPlayer.queueLength < 1) {
      // musicPlayer.loadQueue(playlist)
    }

    if ($currentTrackStore?.audioId === song.audioId) {
      if ($playerStateStore === PLAYER_STATE.IDLE) return musicPlayer.replay()
      if ($playerStateStore !== PLAYER_STATE.PLAYING) return musicPlayer.resume()
      return musicPlayer.pause()
    }

    pageLoading = true
    await musicPlayer.play(song.audioId)
    pageLoading = false
  }

  const onResize = () => (windowWidth = window.innerWidth)
  onMount(onResize)
</script>

<svelte:window on:resize={onResize} />

<a href="/music/demos" class="ml-3 flex h-12 w-12 -scale-x-100 items-center justify-center text-xl">
  <ExitIcon />
</a>

<main class="flex-1 flex-col px-[4vmin]">
  <div class="flex flex-col justify-center sm:flex-row">
    <div class="relative aspect-square w-full max-w-md sm:max-w-xs">
      {#key song.metadata.imageId}
        <img
          class="absolute inset-0 rounded-sm"
          transition:fly|local={{ y: 20, duration: 1000 }}
          src="/api/storage/file/{song.metadata.imageId}?width=480&height=480"
          alt=""
        />
      {/key}
    </div>

    <div class="px-4">
      <h1 class="break-words text-center font-title">{song.metadata.title}</h1>
      <div class="flex items-center justify-between">
        <span class="h-fit text-sm text-neutral-500">{formatUnixDate(song.metadata.timestamp)}</span>
        <button on:click={handlePlayButton} class="text-3xl text-primary-400">
          {#if song.audioId === $currentTrackStore?.audioId && $playerStateStore === PLAYER_STATE.PLAYING}
            <PauseIcon />
          {:else if pageLoading}
            <LoadingIcon />
          {:else}
            <PlayIcon />
          {/if}
        </button>
      </div>

      <ul class="my-3 flex flex-wrap justify-center gap-2">
        {#each artists as artist (artist)}
          <a
            href={artist.url || ""}
            target="_blank"
            out:fly|local={{ x: 10 }}
            in:fly={{ x: -10 }}
            class="ml-1 text-xs">{artist.name}</a
          >
        {/each}
      </ul>

      {#if windowWidth >= 640}
        <div class="w-96">
          <svg viewBox="0 0 {width} {height}">
            <path d={waveform} fill="#fff" />
          </svg>
        </div>
      {/if}

      <ul class="mx-auto flex max-w-sm flex-wrap justify-center gap-2">
        {#key song.metadata.tags}
          {#each song.metadata.tags as tag, i}
            <li in:fly={{ y: 10, delay: i * 100 }}>
              <Tag class="bg-primary-900 text-primary-200">{tag}</Tag>
            </li>
          {/each}
        {/key}
      </ul>
    </div>
  </div>

  <section class="mx-auto my-10 max-w-4xl px-2 text-left">
    {@html parsePost(post)}
  </section>
</main>
