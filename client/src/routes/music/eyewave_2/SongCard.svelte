<script lang="ts">  
  import { isMusicPlayerInitialized } from "src/stores/isMusicPlayerInitialized"
  import { onMount } from "svelte"
  import { PLAYER_STATE } from "$lib/music_player/enums"
  import Card from "$lib/Card.svelte"
  import LoadingIcon from "virtual:icons/line-md/loading-loop"
  import OpenIcon from "virtual:icons/material-symbols/open-in-new-rounded"
  import PauseIcon from "virtual:icons/mingcute/pause-circle-fill"
  import PlayIcon from "virtual:icons/material-symbols/play-circle-rounded"
  import Tag from "$lib/Tag.svelte"
  import type { MusicPlayer } from "$lib/music_player"

  export let playlist:string[]
  export let audioId:string
  export let metadata:{
    title: string,
    imageId:string,
    timestamp: number,
    artists: string[],
    genre: string,
  }


  let musicPlayer:MusicPlayer|undefined
  $: musicPlayer =$isMusicPlayerInitialized
  $: playerStateStore =musicPlayer?.stores.playerStateStore
  $: currentTrackStore =musicPlayer?.stores.currentTrackStore

  let isJavascriptEnabled =false
  let cardLoading =false

  onMount(() => isJavascriptEnabled =true )

  async function handlePlayButton() {
    if ( musicPlayer === undefined ) {
      cardLoading =true
      const { musicPlayer: mplayer } =await import("$lib/music_player")
      isMusicPlayerInitialized.set(mplayer)
      musicPlayer =mplayer
    }

    if ( !musicPlayer.isInitialized ) {
      await musicPlayer.initialize()
    }


    if ( musicPlayer.queueLength < 1 ) {
      musicPlayer.loadQueue(playlist)
    }
    
    if ( $currentTrackStore?.audioId === audioId ) {
      if ( $playerStateStore === PLAYER_STATE.IDLE ) return musicPlayer.replay()
      if ( $playerStateStore !== PLAYER_STATE.PLAYING ) return musicPlayer.resume()
      return musicPlayer.pause()
    }

    cardLoading =true
    await musicPlayer.play(audioId)
    cardLoading =false
  }

</script>

<Card title={metadata.title} img={metadata.imageId}>
  <a aria-label="view more about {metadata.title} here"
    class="absolute right-2 top-2 z-10"
    href="/song/{audioId}">
    
    <OpenIcon />
  </a>

  <Tag class="relative text-primary-300 ml-4">{metadata.genre}</Tag>
    
  {#if isJavascriptEnabled}
    <button on:click={handlePlayButton}
      aria-label="play {metadata.title}"
      class="text-primary-400 text-6xl absolute bottom-1 right-1">
      
      {#if audioId === $currentTrackStore?.audioId && $playerStateStore === PLAYER_STATE.PLAYING }
        <PauseIcon />
      {:else if cardLoading}
        <LoadingIcon />
      {:else}
        <PlayIcon />
      {/if}
    </button>
  {/if}
</Card>