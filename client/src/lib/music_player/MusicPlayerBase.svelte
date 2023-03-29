<script context="module" lang="ts">
  export const musicPlayer =MusicPlayer.getInstance()
</script>
<script lang="ts">
  import { formatSeconds } from "src/utils/time"
  import { MusicPlayer } from "."
  import { onMount } from "svelte"
  import { PLAYER_STATE, PRESET_NAMES, QUEUE_STATE } from "./enums"
  import { PUBLIC_DB_URL } from "$env/static/public"
  import { trimText } from "src/utils/text"
  import AutoplayOffIcon from "virtual:icons/ic/round-play-disabled"
  import LoadingIcon from "virtual:icons/line-md/loading-loop"
  import LoopAllIcon from "virtual:icons/cil/loop"
  import LoopNoneIcon from "virtual:icons/heroicons-solid/arrow-down-on-square"
  import LoopOneIcon from "virtual:icons/cil/loop-1"
  import MoodSwitcher from "./MoodSwitcher.svelte"
  import NextIcon from "virtual:icons/basil/skip-next-solid"
  import PauseIcon from "virtual:icons/typcn/media-pause"
  import PlayIcon from "virtual:icons/material-symbols/play-arrow-rounded"
  import PrevIcon from "virtual:icons/basil/skip-prev-solid"
  import ShuffleIcon from "virtual:icons/ph/shuffle-bold"
  import ShuffleOffIcon from "virtual:icons/tabler/arrows-right"
  import WifiErrorIcon from "virtual:icons/iconoir/wifi-error"
  
  const { playerStateStore, queueStateStore, shuffleOnStore, currentTrackStore, timeStore } =musicPlayer.stores

  $: songTitle =trimText($currentTrackStore?.metadata.title || "",Math.ceil(windowWidth /50) +1)

  let mood =PRESET_NAMES.NORMAL
  let windowWidth =300


  function onWinResize() { windowWidth =window.innerWidth }
  onMount(onWinResize)
  

  async function handlePlayButton() {
    if ( !musicPlayer.isInitialized ) await musicPlayer.initialize()

    switch ( $playerStateStore ) {
      case PLAYER_STATE.PAUSED: return musicPlayer.resume()
      case PLAYER_STATE.PLAYING: return musicPlayer.pause()
      case PLAYER_STATE.IDLE:
        if ( $currentTrackStore?.audioId ) {
          return musicPlayer.replay()
        }
      
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
    musicPlayer.playPrev()
  }

  function handleSongSkip(e:Event) {
    musicPlayer.skipTo(+(e.target as HTMLInputElement).value)
  }

</script>

<svelte:window on:resize={onWinResize} />

<div class="music-player">  
  <div class="button-group">
    {#if windowWidth > 650}
      <button class="text-xl" on:click={handleQueueButton}>
        {#if $queueStateStore === QUEUE_STATE.LOOPALL}
          <LoopAllIcon />
        {:else if $queueStateStore === QUEUE_STATE.LOOPONE}
          <LoopOneIcon />
        {:else if $queueStateStore === QUEUE_STATE.AUTOPLAYOFF}
          <AutoplayOffIcon />
        {:else}
          <LoopNoneIcon class="-rotate-90" />
        {/if}
      </button>
    {/if}

    <button on:click={handlePrevButton}>
      <PrevIcon />
    </button>

    <button on:click={handlePlayButton}>
      {#if $playerStateStore === PLAYER_STATE.ERROR}
        <WifiErrorIcon />
      {:else if $playerStateStore === PLAYER_STATE.LOADING}
        <LoadingIcon />
      {:else if $playerStateStore === PLAYER_STATE.PLAYING}
        <PauseIcon />
      {:else}
        <PlayIcon />
      {/if}
    </button>

    <button on:click={handleNextButton}>
      <NextIcon />
    </button>

    {#if windowWidth > 650}
      <button class="text-xl" on:click={handleShuffleButton}>
        {#if $shuffleOnStore}
          <ShuffleIcon class="text-primary-400" />
        {:else}
          <ShuffleOffIcon />
        {/if}
      </button>
    {/if}
  </div>

  <!-- {#if windowWidth > 1000}
    <AudioGraph />
  {/if} -->

  {#if windowWidth > 450}
    <div class="progress-bar">
      <label for="progress-bar" class="w-14 font-bold">{formatSeconds($timeStore)}</label>

      {#if windowWidth > 500}
        <input class="min-w-0 w-full"
          on:change={handleSongSkip}
          type="range" name="progress-bar" min={0} max={$currentTrackStore?.duration || 0} value={$timeStore}>
      {/if}
        
      <label for="progress-bar" class="w-14">{formatSeconds($currentTrackStore?.duration || 0)}</label>
    </div>
  {/if}

  <div class="song-title">
    <div>
      <p>{songTitle}</p>
      <p class="text-right text-xs text-neutral-400">{$currentTrackStore?.metadata.artists || ""}</p>
    </div>
    <a href="#{$currentTrackStore?.audioId}" class="w-12 h-12 flex-shrink-0">
      <img width={48} height={48} src="{PUBLIC_DB_URL}/storage/file/{$currentTrackStore?.metadata.imageId}?width=48&height=48" alt="?">
    </a>
  </div>

  {#if windowWidth > 350}
    <MoodSwitcher bind:currentMood={mood} on:change={() => musicPlayer?.audioEffects?.loadPreset(mood)} />
  {/if}

</div>


<style lang="postcss">
  .music-player {
    z-index: 2;
    bottom: 0;
    position: sticky;
    @apply flex justify-between gap-2 h-16;
    @apply bg-black py-1 px-3;
  }

  .button-group {
    @apply flex items-center gap-1;
    @apply text-3xl text-primary-100 w-fit px-2;
    flex-shrink: 0.2;
    z-index: 2;
  }

  .progress-bar {
    @apply flex text-center items-center w-full max-w-2xl;
    @apply text-xs md:text-sm;
    flex-shrink: 1;
    min-width: 4rem;
  }

  .song-title {
    @apply flex gap-2 justify-end w-32;
    flex-shrink: 0.6;
    word-break: keep-all;
  }


</style>