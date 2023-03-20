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
  import AudioGraph from "./music_player/audio_effects/AudioGraph.svelte"
  import { QUEUE_STATE } from "./music_player"
  import { formatSeconds } from "src/utils/time"

  const { playerStateStore, queueStateStore, shuffleOnStore, currentTrackStore, timeStore } =musicPlayer.stores


  async function handlePlayButton() {
    if ( !musicPlayer.isInitialized ) await musicPlayer.initialize()

    switch ( $playerStateStore ) {
      case PLAYER_STATE.paused: return musicPlayer.resume()
      case PLAYER_STATE.playing: return musicPlayer.pause()
      
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

<div class="music-player">
  <div class="flex items-center gap-1 text-3xl text-primary-100">
    
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

    <button class="text-xl" on:click={handleShuffleButton}>
      {#if $shuffleOnStore}
        <ShuffleIcon class="text-primary-400" />
      {:else}
        <ShuffleOffIcon />
      {/if}
    </button>
  </div>

  <AudioGraph />

  <div class="flex text-center items-center">
    <input class="w-screen max-w-md" type="range" name="progress-bar" min={0} max={$currentTrackStore?.duration || 0} value={$timeStore}>
    <label for="progress-bar" class="w-28">{formatSeconds($timeStore)} : {formatSeconds($currentTrackStore?.duration || 0)}</label>
  </div>

  <div class="flex gap-2 justify-end">
    <div>
      <p>{$currentTrackStore?.metadata.title || ""}</p>
      <p class="text-right text-xs text-neutral-400">{$currentTrackStore?.metadata.artists || ""}</p>
    </div>
    <img class="w-12 h-12" width={48} height={48} src="http://localhost:3000/storage/file/{$currentTrackStore?.metadata.imageId}?width=48&height=48" alt="?">
  </div>

</div>


<style lang="postcss">
  .music-player {
    bottom: 0;
    position: sticky;
    display: grid;
    grid-template-columns: 232px 1fr 2fr 1fr;

    @apply h-16 place-content-center;
    @apply bg-black py-1 px-3;
  }

  button {
    @apply flex-shrink-0;
  }

</style>