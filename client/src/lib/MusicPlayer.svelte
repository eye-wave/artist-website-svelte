<script context="module" lang="ts">
  export const musicPlayer =MusicPlayer.getInstance()
</script>
<script lang="ts">
  import LoopAllIcon from "virtual:icons/cil/loop"
  import LoopOneIcon from "virtual:icons/cil/loop-1"
  import LoopNoneIcon from "virtual:icons/heroicons-solid/arrow-down-on-square"
  import PrevIcon from "virtual:icons/basil/skip-prev-solid"
  import NextIcon from "virtual:icons/basil/skip-next-solid"
  import WifiErrorIcon from "virtual:icons/iconoir/wifi-error"
  import LoadingIcon from "virtual:icons/line-md/loading-loop"
  import PauseIcon from "virtual:icons/typcn/media-pause"
  import PlayIcon from "virtual:icons/material-symbols/play-arrow-rounded"
  import ShuffleIcon from "virtual:icons/ph/shuffle-bold"
  import ShuffleOffIcon from "virtual:icons/tabler/arrows-right"
  import AutoplayOffIcon from "virtual:icons/ic/round-play-disabled"

  import { MusicPlayer, PLAYER_STATE } from "./music_player"
  // import AudioGraph from "./music_player/audio_effects/AudioGraph.svelte"
  import { QUEUE_STATE } from "./music_player"
  import { formatSeconds } from "src/utils/time"
  import { onDestroy, onMount } from "svelte"
  import { trimText } from "src/utils/text"
  const { playerStateStore, queueStateStore, shuffleOnStore, currentTrackStore, timeStore } =musicPlayer.stores

  let windowWidth =300
  function onWinResize() { windowWidth =window.innerWidth }
  onMount(onWinResize)
  
  $: songTitle =trimText($currentTrackStore?.metadata.title || "",Math.ceil(windowWidth /50) +1)

  async function handlePlayButton() {
    if ( !musicPlayer.isInitialized ) await musicPlayer.initialize()

    switch ( $playerStateStore ) {
      case PLAYER_STATE.paused: return musicPlayer.resume()
      case PLAYER_STATE.playing: return musicPlayer.pause()
      case PLAYER_STATE.idle: {
        if ( $currentTrackStore?.audioId ) {
          return musicPlayer.replay()
        }
      }
      
      default: return
    }
  }

  function handleQueueButton() {
    switch ( $queueStateStore ) {
      case QUEUE_STATE.loopall: return musicPlayer.queueState =QUEUE_STATE.loopone
      case QUEUE_STATE.loopone: return musicPlayer.queueState =QUEUE_STATE.loopoff
      case QUEUE_STATE.loopoff: return musicPlayer.queueState =QUEUE_STATE.autoplayoff
      case QUEUE_STATE.autoplayoff: return musicPlayer.queueState =QUEUE_STATE.loopall
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

</script>

<svelte:window on:resize={onWinResize} />

<div class="music-player">  
  <div class="button-group">
    {#if windowWidth > 650}
      <button class="text-xl" on:click={handleQueueButton}>
        {#if $queueStateStore === QUEUE_STATE.loopall}
          <LoopAllIcon />
        {:else if $queueStateStore === QUEUE_STATE.loopone}
          <LoopOneIcon />
        {:else if $queueStateStore === QUEUE_STATE.autoplayoff}
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
      {#if $playerStateStore === PLAYER_STATE.error}
        <WifiErrorIcon />
      {:else if $playerStateStore === PLAYER_STATE.loading}
        <LoadingIcon />
      {:else if $playerStateStore === PLAYER_STATE.playing}
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
          on:change={e => musicPlayer.skipTo(e?.target?.value || 0)}
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
    <img class="w-12 h-12" width={48} height={48} src="http://localhost:3000/storage/file/{$currentTrackStore?.metadata.imageId}?width=48&height=48" alt="?">
  </div>

  <select on:change={e => musicPlayer.audioEffects?.loadPreset(e.target.value)}>
    <option value="normal">normal</option>
    <option value="tiktok">tiktok</option>
    <option value="meme">meme</option>
    <option value="nightcore">nightcore</option>
  </select>

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