<script lang="ts">
  import "$lib/screenEffects.css"
  import { fly } from "svelte/transition"
  import { formatSeconds } from "~/utils/time"
  import { musicPlayer } from "."
  import { PLAYER_STATE, QUEUE_STATE, type T_PLAYER_STATE, type T_QUEUE_STATE } from "./enums"
  import { trimText } from "~/utils/text"
  import { type SvelteComponent, onMount } from "svelte"
  import ArrowUpIcon from "virtual:icons/material-symbols/keyboard-arrow-up-rounded"
  import AutoplayOffIcon from "virtual:icons/ic/round-play-disabled"
  import LoadingIcon from "virtual:icons/line-md/loading-loop"
  import LoopAllIcon from "virtual:icons/cil/loop"
  import LoopOffIcon from "virtual:icons/heroicons-solid/arrow-down-on-square"
  import LoopOneIcon from "virtual:icons/cil/loop-1"
  import MutedIcon from "virtual:icons/material-symbols/volume-off-rounded"
  import NextIcon from "virtual:icons/basil/skip-next-solid"
  import PauseIcon from "virtual:icons/typcn/media-pause"
  import PlayIcon from "virtual:icons/material-symbols/play-arrow-rounded"
  import PrevIcon from "virtual:icons/basil/skip-prev-solid"
  import ShuffleIcon from "virtual:icons/ph/shuffle-bold"
  import ShuffleOffIcon from "virtual:icons/tabler/arrows-right"
  import Slider from "$lib/inputs/Slider.svelte"
  import Tooltip from "../Tooltip.svelte"
  import VolumeIcon from "virtual:icons/ic/round-volume-up"
  import WifiErrorIcon from "virtual:icons/iconoir/wifi-error"

  const { playerStateStore, queueStateStore, shuffleOnStore, currentTrackStore, timeStore, volumeStore } = musicPlayer.stores
  const playerStateComponents = new Map<T_PLAYER_STATE, SvelteComponent>([
    [PLAYER_STATE.ERROR, WifiErrorIcon],
    [PLAYER_STATE.IDLE, PlayIcon],
    [PLAYER_STATE.LOADING, LoadingIcon],
    [PLAYER_STATE.PAUSED, PlayIcon],
    [PLAYER_STATE.PLAYING, PauseIcon],
  ])
  const queueStateComponents = new Map<T_QUEUE_STATE, SvelteComponent>([
    [QUEUE_STATE.AUTOPLAYOFF, AutoplayOffIcon],
    [QUEUE_STATE.LOOPALL, LoopAllIcon],
    [QUEUE_STATE.LOOPOFF, LoopOffIcon],
    [QUEUE_STATE.LOOPONE, LoopOneIcon],
  ])

  type ComponentType = typeof import("./MusicPlayerFullscreen.svelte").default

  let fullScreen = false
  let FullScreen: ComponentType
  let isOnMobile = true
  let windowWidth = 300

  $: {
    if (fullScreen && !FullScreen) {
      import("./MusicPlayerFullscreen.svelte").then(_module => (FullScreen = _module.default))
    }
  }

  function onWinResize() {
    windowWidth = window.innerWidth
  }
  onMount(() => {
    onWinResize()

    const mediaQueryList: MediaQueryList = window.matchMedia("(hover: hover)")
    isOnMobile = !mediaQueryList.matches
  })

  $: songTitle = trimText($currentTrackStore?.metadata.title || "", windowWidth > 450 ? 999 : windowWidth * 0.07)
  $: songUrl = `/song/${$currentTrackStore?.audioId}`

  async function handlePlayButton() {
    if (!musicPlayer.isInitialized) await musicPlayer.initialize()

    switch ($playerStateStore) {
      case PLAYER_STATE.PAUSED:
        return musicPlayer.resume()
      case PLAYER_STATE.PLAYING:
        return musicPlayer.pause()
      case PLAYER_STATE.IDLE:
        return $currentTrackStore?.audioId ? musicPlayer.replay() : void 0
      default:
        return
    }
  }

  function handleQueueButton() {
    switch ($queueStateStore) {
      case QUEUE_STATE.LOOPALL:
        return (musicPlayer.queueState = QUEUE_STATE.LOOPONE)
      case QUEUE_STATE.LOOPONE:
        return (musicPlayer.queueState = QUEUE_STATE.LOOPOFF)
      case QUEUE_STATE.LOOPOFF:
        return (musicPlayer.queueState = QUEUE_STATE.AUTOPLAYOFF)
      case QUEUE_STATE.AUTOPLAYOFF:
        return (musicPlayer.queueState = QUEUE_STATE.LOOPALL)
      default:
        return (musicPlayer.queueState = QUEUE_STATE.AUTOPLAYOFF)
    }
  }

  function handleShuffleButton() {
    musicPlayer.shuffleOn = !musicPlayer.shuffleOn
  }

  async function handleNextButton() {
    if (!musicPlayer.isInitialized) await musicPlayer.initialize()
    musicPlayer.playNext()
  }

  async function handlePrevButton() {
    if (!musicPlayer.isInitialized) await musicPlayer.initialize()
    if ($timeStore > 3) {
      musicPlayer.skipTo(0)
      return
    }

    musicPlayer.playPrev()
  }

  function handleSongSkip(e: CustomEvent) {
    musicPlayer.skipTo(e.detail * ($currentTrackStore?.duration || 1))
  }
</script>

<svelte:window on:resize={onWinResize} />

{#if !fullScreen}
  <div class="music-player" transition:fly={{ y: 30 }}>
    <div class="button-group">
      {#if windowWidth > 850}
        <button class="text-xl" on:click={handleQueueButton}>
          <svelte:component
            this={queueStateComponents.get($queueStateStore) || AutoplayOffIcon}
            class={$queueStateStore === QUEUE_STATE.LOOPOFF ? "-rotate-90" : ""}
          />
        </button>
      {/if}

      {#if windowWidth > 420}
        <button on:click={handlePrevButton}>
          <PrevIcon />
        </button>
      {/if}

      <button on:click={handlePlayButton}>
        <svelte:component this={playerStateComponents.get($playerStateStore) || WifiErrorIcon} />
      </button>

      {#if windowWidth > 420}
        <button on:click={handleNextButton}>
          <NextIcon />
        </button>
      {/if}

      {#if windowWidth > 850}
        <button class="text-xl" on:click={handleShuffleButton}>
          {#if $shuffleOnStore}
            <ShuffleIcon class="text-primary-400" />
          {:else}
            <ShuffleOffIcon />
          {/if}
        </button>
      {/if}
    </div>

    {#if windowWidth > 1000}
      <div class="progress-bar">
        <label for="progress-bar" class="w-14 font-bold">{formatSeconds($timeStore)}</label>
        <Slider on:change={handleSongSkip} max={$currentTrackStore?.duration} value={$timeStore} />
        <label for="progress-bar" class="w-14">{formatSeconds($currentTrackStore?.duration || 0)}</label>
      </div>

      <button
        on:click={() => (fullScreen = true)}
        class="absolute inset-0 -top-1 left-[50%] flex h-7 w-full max-w-lg -translate-x-[50%] -translate-y-full justify-center rounded-full bg-neutral-900 text-xl shadow-md"
      >
        <ArrowUpIcon />
      </button>
    {:else}
      <button on:click={() => (fullScreen = true)} class="flex w-full justify-center text-2xl">
        <ArrowUpIcon />
      </button>
    {/if}

    {#if !isOnMobile}
      <Tooltip class="flex h-8 w-8 flex-shrink-0 items-center text-xl">
        <button on:click={() => musicPlayer.setVolume($volumeStore > 0 ? 0 : 1)}>
          <svelte:component this={$volumeStore < 0.01 ? MutedIcon : VolumeIcon} />
        </button>
        <div slot="tooltip" class="-translate-x-5 translate-y-28 rounded-md bg-neutral-900 ring-2 ring-primary-500">
          <div class="pt-4 text-center text-sm text-primary-400">{Math.floor($volumeStore * 100)}%</div>
          <Slider
            on:change={e => musicPlayer.setVolume(1 - e.detail)}
            value={(1 - $volumeStore) * 100}
            maxSize={200}
            fixed={true}
            vertical={true}
          />
        </div>
      </Tooltip>
    {/if}

    <div class="flex w-96 justify-end gap-2">
      <div class="flex flex-col items-end">
        <a href={songUrl} class="font-title">{songTitle}</a>
      </div>

      <a href={songUrl} class="relative h-12 w-12" draggable="false">
        {#key $currentTrackStore?.metadata.imageId || ""}
          <img
            transition:fly={{ x: -20 }}
            class="absolute inset-0 rounded-sm"
            src="/api/storage/file/{$currentTrackStore?.metadata.imageId}?width=48&height=48"
            draggable="false"
            alt=""
          />
        {/key}
      </a>
    </div>
  </div>
{/if}

{#if fullScreen && FullScreen}
  <svelte:component
    this={FullScreen}
    on:close={() => (fullScreen = false)}
    {handleNextButton}
    {handlePlayButton}
    {handlePrevButton}
    {handleQueueButton}
    {handleShuffleButton}
    {handleSongSkip}
    {windowWidth}
    artists={$currentTrackStore?.metadata.artists || []}
    currentTime={$timeStore || 0}
    duration={$currentTrackStore?.duration || 0}
    image={$currentTrackStore?.metadata.imageId || "null"}
    playerComponent={playerStateComponents.get($playerStateStore) || WifiErrorIcon}
    queueComponent={queueStateComponents.get($queueStateStore) || AutoplayOffIcon}
    queueState={$queueStateStore}
    shuffleOn={$shuffleOnStore}
    title={$currentTrackStore?.metadata.title || "untitled"}
  />
{/if}

<style lang="postcss">
  .music-player {
    z-index: 20;
    bottom: 0;
    position: sticky;
    @apply px-1 py-1 sm:px-[10vmin];
    @apply flex h-16 items-center justify-between gap-2;
    @apply mx-1 select-none rounded-md bg-neutral-900;
  }

  .button-group {
    @apply flex flex-shrink-0 items-center gap-1;
    @apply w-fit px-2 text-3xl text-primary-100;
    z-index: 2;
  }

  .progress-bar {
    min-width: 40vmin;
    max-width: 90vmin;
    @apply flex w-full max-w-2xl items-center text-center;
    @apply text-xs md:text-sm;
  }
</style>
