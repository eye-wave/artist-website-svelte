<script context="module" lang="ts">
  export const musicPlayer =createMusicPlayer()
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

  import { createMusicPlayer, PLAYER_STATE, QUEUE_STATE } from "./music_player"
  import AudioGraph from "./music_player/audio_effects/AudioGraph.svelte";

  const { playerStateStore, queueStateStore, shuffleOnStore, currentTrackStore } =musicPlayer.stores


  const songId ="ROtjNQyggjKB5AdnlIQhIg"

  async function handlePlayButton() {
    if ( !musicPlayer.isInitialized ) await musicPlayer.initialize()
    if ( musicPlayer.currentTrack?.id !== songId ) await musicPlayer.downloadSong( songId )

    switch ( $playerStateStore ) {
      case PLAYER_STATE.paused: return musicPlayer.resume()
      case PLAYER_STATE.playing: return musicPlayer.pause()
      
      default: return musicPlayer.play( songId ) 
    }
  }

  function handleQueueButton() {
    switch ( $queueStateStore ) {
      case QUEUE_STATE.loopall: return musicPlayer.queue =QUEUE_STATE.loopone
      case QUEUE_STATE.loopone: return musicPlayer.queue =QUEUE_STATE.loopoff
      case QUEUE_STATE.loopoff: return musicPlayer.queue =QUEUE_STATE.loopall
    }
  }

  function handleShuffleButton() {
    musicPlayer.shuffleOn =!musicPlayer.shuffleOn
  }

</script>

<div class="sticky bottom-0 mt-auto w-full h-14 bg-black text-white flex p-1 gap-2">
  <img width={48} height={48} src="http://localhost:3000/storage/file/{$currentTrackStore?.cover}?width=48&height=48" alt="">

  <div class="flex gap-1 text-3xl text-primary-100">
    
    <button class="text-xl" on:click={handleQueueButton}>
      {#if $queueStateStore === QUEUE_STATE.loopall}
        <LoopAllIcon />
      {:else if $queueStateStore === QUEUE_STATE.loopone}
        <LoopOneIcon />
      {:else}
        <LoopNoneIcon class="-rotate-90" />
      {/if}
    </button>

    <button>
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

    <button>
      <NextIcon />
    </button>

    <button class="text-xl" on:click={handleShuffleButton}>
      {#if $shuffleOnStore}
        <ShuffleIcon />
      {:else}
        <ShuffleOffIcon />
      {/if}
    </button>
  </div>
  <AudioGraph />
</div>
