<script lang="ts">
  import { artistMap } from "src/stores/artists"
  import { fly } from "svelte/transition"
  import { formatUnixDate } from "src/utils/date"
  import { isMusicPlayerInitialized } from "src/stores/isMusicPlayerInitialized"
  import { onMount } from "svelte"
  import { parsePost } from "./parser"
  import { PLAYER_STATE } from "src/lib/music_player/enums"
  import { PUBLIC_DB_URL } from "$env/static/public"
  import ExitIcon from "virtual:icons/material-symbols/exit-to-app-rounded"
  import LoadingIcon from "virtual:icons/line-md/loading-loop"
  import PauseIcon from "virtual:icons/mingcute/pause-circle-fill"
  import PlayIcon from "virtual:icons/material-symbols/play-circle-rounded"
  import Tag from "$lib/Tag.svelte"
  import type { MusicPlayer } from "$lib/music_player"

  export let data
  
  let musicPlayer:MusicPlayer|undefined
  let pageLoading =false
  let windowWidth =300

  const width =800
  const height =200

  $: musicPlayer =$isMusicPlayerInitialized
  $: playerStateStore =musicPlayer?.stores.playerStateStore
  $: currentTrackStore =musicPlayer?.stores.currentTrackStore
  $: song =data.song
  $: post =data.post
  $: waveform =data.waveform
  $: artists =data.artists

  async function handlePlayButton() {
    if ( musicPlayer === undefined ) {
      pageLoading =true
      const { musicPlayer: mplayer } =await import("$lib/music_player")
      isMusicPlayerInitialized.set(mplayer)
      musicPlayer =mplayer
    }

    if ( !musicPlayer.isInitialized ) {
      await musicPlayer.initialize()
    }


    if ( musicPlayer.queueLength < 1 ) {
      // musicPlayer.loadQueue(playlist)
    }
    
    if ( $currentTrackStore?.audioId === song.audioId ) {
      if ( $playerStateStore === PLAYER_STATE.IDLE ) return musicPlayer.replay()
      if ( $playerStateStore !== PLAYER_STATE.PLAYING ) return musicPlayer.resume()
      return musicPlayer.pause()
    }

    pageLoading =true
    await musicPlayer.play(song.audioId)
    pageLoading =false
  }


  const onResize =() => windowWidth =window.innerWidth
  onMount(onResize)

</script>

<svelte:window on:resize={onResize} />

<a href="/music/eyewave_2" class="ml-3 text-xl -scale-x-100 w-12 h-12 flex justify-center items-center">
  <ExitIcon />
</a>

<main class="px-[4vmin] flex-col flex-1">
  <div class="flex flex-col sm:flex-row justify-center">

    <div class="relative aspect-square w-full max-w-md sm:max-w-xs">
      {#key song.metadata.imageId}
        <img class="rounded-sm absolute inset-0"
          transition:fly|local={{ y: 20, duration: 1000 }}
          src="{PUBLIC_DB_URL}/storage/file/{song.metadata.imageId}?width=480&height=480" alt=""/>
      {/key}
    </div>
  
    <div class="px-4">
      
      <h1 class="break-words font-title text-center">{song.metadata.title}</h1>  
      <div class="flex justify-between items-center">
        <span class="text-sm text-neutral-500 h-fit">{formatUnixDate(song.metadata.timestamp)}</span>
        <button on:click={handlePlayButton} class="text-primary-400 text-3xl">
          {#if song.audioId === $currentTrackStore?.audioId && $playerStateStore === PLAYER_STATE.PLAYING }
            <PauseIcon />
          {:else if pageLoading}
            <LoadingIcon />
          {:else}
            <PlayIcon />
          {/if}
        </button>
      </div>
  
      <ul class="flex flex-wrap gap-2 justify-center my-3">
        {#each song.metadata.artists as artist (artist)}
          <a href={artistMap.get(artist)?.link || ""} target="_blank"
            out:fly|local={{ x: 10 }} in:fly={{ x: -10 }}
            class="text-xs ml-1">{artist}</a>
        {/each}
      </ul>


      {#if windowWidth >= 640}
        <div class="w-96">
          <svg viewBox="0 0 {width} {height}">
            <path d={waveform} fill="#fff" />
          </svg>
        </div>
      {/if}
  
      <ul class="max-w-sm flex flex-wrap gap-2 justify-center mx-auto">
        {#key song.metadata.tags}
          {#each song.metadata.tags as tag,i}
            <li in:fly={{ y: 10, delay: i *100 }}>
              <Tag class="text-primary-200 bg-primary-900">{tag}</Tag>
            </li>
          {/each}
        {/key}
      </ul>

    </div>

  </div>
  
  <section class="my-10 px-2 mx-auto max-w-4xl text-left">
    {@html parsePost(post)}
  </section>


</main>

