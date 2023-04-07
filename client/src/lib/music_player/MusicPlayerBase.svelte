<script lang="ts">
  import { fly } from "svelte/transition"
  import { formatSeconds } from "src/utils/time"
  import { musicPlayer } from "."
  import { type SvelteComponent, onMount } from "svelte"
  import { PLAYER_STATE, QUEUE_STATE, type T_PLAYER_STATE, type T_QUEUE_STATE } from "./enums"
  import { PUBLIC_DB_URL } from "$env/static/public"
  import { trimText } from "src/utils/text"
  import AutoplayOffIcon from "virtual:icons/ic/round-play-disabled"
  import LoadingIcon from "virtual:icons/line-md/loading-loop"
  import LoopAllIcon from "virtual:icons/cil/loop"
  import LoopOffIcon from "virtual:icons/heroicons-solid/arrow-down-on-square"
  import LoopOneIcon from "virtual:icons/cil/loop-1"
  import NextIcon from "virtual:icons/basil/skip-next-solid"
  import PauseIcon from "virtual:icons/typcn/media-pause"
  import PlayIcon from "virtual:icons/material-symbols/play-arrow-rounded"
  import PrevIcon from "virtual:icons/basil/skip-prev-solid"
  import ShuffleIcon from "virtual:icons/ph/shuffle-bold"
  import ShuffleOffIcon from "virtual:icons/tabler/arrows-right"
  import Slider from "../Slider.svelte"
  import WifiErrorIcon from "virtual:icons/iconoir/wifi-error"
  import ArrowUpIcon from "virtual:icons/material-symbols/keyboard-arrow-up-rounded"
  
  const { playerStateStore, queueStateStore, shuffleOnStore, currentTrackStore, timeStore } =musicPlayer.stores
  const playerStateComponents =new Map<T_PLAYER_STATE,SvelteComponent>([
    [PLAYER_STATE.ERROR,WifiErrorIcon],
    [PLAYER_STATE.LOADING,LoadingIcon],
    [PLAYER_STATE.PAUSED,PlayIcon],
    [PLAYER_STATE.IDLE,PlayIcon],
    [PLAYER_STATE.PLAYING,PauseIcon],
  ])
  const queueStateComponents =new Map<T_QUEUE_STATE,SvelteComponent>([
    [QUEUE_STATE.AUTOPLAYOFF,AutoplayOffIcon],
    [QUEUE_STATE.LOOPALL,LoopAllIcon],
    [QUEUE_STATE.LOOPOFF,LoopOffIcon],
    [QUEUE_STATE.LOOPONE,LoopOneIcon],
  ])

  type ComponentType =typeof import("./MusicPlayerFullscreen.svelte").default

  let FullScreen:ComponentType
  
  let windowWidth =300
  let fullScreen =false
  $: {
    if ( fullScreen && !FullScreen ) {
      import("./MusicPlayerFullscreen.svelte")
        .then(_module => FullScreen =_module.default )
    }
  }

  function onWinResize() { windowWidth =window.innerWidth }
  onMount(onWinResize)

  $: songTitle =trimText($currentTrackStore?.metadata.title || "",windowWidth > 450 ? 999 : windowWidth *0.07)
  $: songUrl =`/song/${$currentTrackStore?.audioId}`

  async function handlePlayButton() {
    if ( !musicPlayer.isInitialized ) await musicPlayer.initialize()

    switch ( $playerStateStore ) {
      case PLAYER_STATE.PAUSED: return musicPlayer.resume()
      case PLAYER_STATE.PLAYING: return musicPlayer.pause()
      case PLAYER_STATE.IDLE: return $currentTrackStore?.audioId ? musicPlayer.replay() : void 0
      default: return
    }
  }

  function handleQueueButton() {
    switch ( $queueStateStore ) {
      case QUEUE_STATE.LOOPALL: return musicPlayer.queueState =QUEUE_STATE.LOOPONE
      case QUEUE_STATE.LOOPONE: return musicPlayer.queueState =QUEUE_STATE.LOOPOFF
      case QUEUE_STATE.LOOPOFF: return musicPlayer.queueState =QUEUE_STATE.AUTOPLAYOFF
      case QUEUE_STATE.AUTOPLAYOFF: return musicPlayer.queueState =QUEUE_STATE.LOOPALL
      default: return musicPlayer.queueState =QUEUE_STATE.AUTOPLAYOFF
    }
  }

  function handleShuffleButton() { musicPlayer.shuffleOn =!musicPlayer.shuffleOn }

  async function handleNextButton() {
    if ( !musicPlayer.isInitialized ) await musicPlayer.initialize()
    musicPlayer.playNext()
  }

  async function handlePrevButton() {
    if ( !musicPlayer.isInitialized ) await musicPlayer.initialize()
    if ( $timeStore > 3 ) {
      musicPlayer.skipTo(0)
      return
    }

    musicPlayer.playPrev()
  }

  function handleSongSkip(e:CustomEvent) {
    musicPlayer.skipTo(e.detail *($currentTrackStore?.duration || 1))
  }

</script>

<svelte:window on:resize={onWinResize} />

{#if !fullScreen}
  <div class="music-player" transition:fly={{y: 30}}>
    <div class="button-group">
      {#if windowWidth > 850}
        <button class="text-xl" on:click={handleQueueButton}>
          <svelte:component
            class={$queueStateStore === QUEUE_STATE.LOOPOFF ? "-rotate-90" : ""}
            this={queueStateComponents.get($queueStateStore) || AutoplayOffIcon} />
        </button>
      {/if}

      {#if windowWidth > 420 }
        <button on:click={handlePrevButton}>
          <PrevIcon />
        </button>
      {/if}

      <button on:click={handlePlayButton}>
        <svelte:component this={playerStateComponents.get($playerStateStore) || WifiErrorIcon} />
      </button>

      {#if windowWidth > 420 }
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
        <Slider
          on:change={handleSongSkip}
          max={$currentTrackStore?.duration} value={$timeStore}/>
        <label for="progress-bar" class="w-14">{formatSeconds($currentTrackStore?.duration || 0)}</label>
      </div>

      <button on:click={() => fullScreen =true }
        class="absolute w-full h-8 bg-white/10 inset-0 -translate-y-full flex justify-center text-xl">
        <ArrowUpIcon />
      </button>
    {:else}
      <button on:click={() => fullScreen =true }
        class="w-full flex justify-center text-2xl">
        <ArrowUpIcon />
      </button>
    {/if}

    <div class="flex w-96 justify-end gap-2">
      <div class="flex flex-col items-end">
        <a href={songUrl}
          class="font-title">{songTitle}</a>
      </div>
      
      <a href={songUrl} class="w-12 h-12 relative" draggable="false">
        {#key $currentTrackStore?.metadata.imageId || ""}
          <img transition:fly={{ x: -20 }} class="absolute inset-0 rounded-sm"
            draggable="false"
            src="{PUBLIC_DB_URL}/storage/file/{$currentTrackStore?.metadata.imageId}?width=48&height=48" alt="">
        {/key}
      </a>
    </div>

  </div>
{/if}

{#if fullScreen && FullScreen}
  <FullScreen
    on:close={() => fullScreen =false}
    {handleNextButton}
    {handlePlayButton}
    {handlePrevButton}
    {handleQueueButton}
    {handleShuffleButton}
    {handleSongSkip}
    {windowWidth}
    title={$currentTrackStore?.metadata.title || "untitled"}
    artists={$currentTrackStore?.metadata.artists || []}
    currentTime={$timeStore || 0}
    duration={$currentTrackStore?.duration || 0}
    image={$currentTrackStore?.metadata.imageId || "null"}
    playerComponent={playerStateComponents.get($playerStateStore) || WifiErrorIcon}
    queueComponent={queueStateComponents.get($queueStateStore) || AutoplayOffIcon}
    queueState={$queueStateStore}
    shuffleOn={$shuffleOnStore}
  />
{/if}


<style lang="postcss">
  .music-player {
    z-index: 20;
    bottom: 0;
    position: sticky;
    @apply py-1 px-1 sm:px-[10vmin];
    @apply flex justify-between gap-2 h-16;
    @apply bg-black select-none;
  }

  .button-group {
    @apply flex items-center gap-1 flex-shrink-0;
    @apply text-3xl text-primary-100 w-fit px-2;
    z-index: 2;
  }

  .progress-bar {
    min-width: 40vmin;
    max-width: 90vmin;
    @apply flex text-center items-center w-full max-w-2xl;
    @apply text-xs md:text-sm;
  }

</style>