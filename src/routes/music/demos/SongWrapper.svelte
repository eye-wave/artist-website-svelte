<script lang="ts">
  import { isMusicPlayerInitialized } from "~/stores/isMusicPlayerInitialized"
  import { onMount } from "svelte"
  import { PLAYER_STATE } from "$lib/music_player/enums"

  export let audioId: string
  export let playlist: string[]

  $: musicPlayer = $isMusicPlayerInitialized
  $: currentTrackStore = musicPlayer?.stores.currentTrackStore
  $: playerStateStore = musicPlayer?.stores.playerStateStore

  let cardLoading = false
  let isJavascriptEnabled = false

  onMount(() => (isJavascriptEnabled = true))

  async function handlePlayButton() {
    if (musicPlayer === undefined) {
      cardLoading = true
      const { musicPlayer: mplayer } = await import("$lib/music_player")
      isMusicPlayerInitialized.set(mplayer)
      musicPlayer = mplayer
    }

    if (!musicPlayer.isInitialized) {
      await musicPlayer.initialize()
    }

    if (musicPlayer.queueLength < 1) {
      musicPlayer.loadQueue(playlist)
    }

    if ($currentTrackStore?.audioId === audioId) {
      if ($playerStateStore === PLAYER_STATE.IDLE) return musicPlayer.replay()
      if ($playerStateStore !== PLAYER_STATE.PLAYING) return musicPlayer.resume()
      return musicPlayer.pause()
    }

    cardLoading = true

    await musicPlayer.play(audioId)

    cardLoading = false
  }
</script>

<slot {handlePlayButton} {cardLoading} {isJavascriptEnabled} {currentTrackStore} />
