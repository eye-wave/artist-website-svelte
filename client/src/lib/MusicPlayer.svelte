<script context="module" lang="ts">
  export const musicPlayer =createMusicPlayer()
</script>
<script lang="ts">
  import { createMusicPlayer } from "./music_player"

  const songId ="ROtjNQyggjKB5AdnlIQhIg"

  async function handlePlay() {
    if ( !musicPlayer.isInitialized ) await musicPlayer.initialize()
    if ( musicPlayer.currentTrack?.id !== songId ) await musicPlayer.downloadSong( songId )

    musicPlayer.play( songId )
  }

  const stateMap =["playing", "paused", "idle", "loading", "error"]
  const playerStateStore =musicPlayer.stores.playerStateStore
  const currentTrackStore =musicPlayer.stores.currentTrackStore

  function handlePause() { musicPlayer?.pause() }
  function handleResume() { musicPlayer?.resume() }
</script>

<div class="fixed bottom-0 w-full h-14 bg-neutral-800 text-white flex p-1 gap-2">
  <img src="http://localhost:3000/storage/file/{$currentTrackStore?.cover}?width=48&height=48" alt="">

  <button on:click={handlePlay}>
    play
  </button>

  <h1>state: {stateMap[$playerStateStore]}</h1>
</div>
