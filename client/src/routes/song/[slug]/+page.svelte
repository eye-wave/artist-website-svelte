<script lang="ts">
  import { artistMap } from "src/stores/artists"
  import { curveBumpY as curve, line, scaleLinear } from "d3"
  import { fly } from "svelte/transition"
  import { formatUnixDate } from "src/utils/date"
  import { isMusicPlayerInitialized } from "src/stores/isMusicPlayerInitialized"
  import { onMount } from "svelte"
  import { parsePost } from "./parser"
  import { PLAYER_STATE } from "src/lib/music_player/enums";
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

  $: musicPlayer =$isMusicPlayerInitialized
  $: playerStateStore =musicPlayer?.stores.playerStateStore
  $: currentTrackStore =musicPlayer?.stores.currentTrackStore

  const a =2

  $: song =data.song
  $: post =data.post
  $: waveform =data.waveform
  $: artists =data.artists

  type Point2D = { x: number, y: number };

  function convertToPoint2DArray(input: Int8Array): Point2D[] {
    const point2DArray: Point2D[] = []

    for (let i = 0; i < input.length; i++) {
      const currentNumber = input[i]
      const diffPrev =Math.abs(currentNumber -input[i -1])
      const diffNext =Math.abs(currentNumber -input[i +1])
      const diff = diffPrev + diffNext

      if ( i > 0 && i < input.length && diff < 1 ) continue

      const point2D: Point2D = { x: i, y: currentNumber }
      point2DArray.push(point2D)
    }

    point2DArray.unshift({x:0,y:0})
    point2DArray.push({x:input.length,y:0})

    return point2DArray
  }


  const width =800
  const height =200

  $: optimized =convertToPoint2DArray(waveform)

  $: x =scaleLinear()
    .domain([0,waveform.length])
    .range([0,width])

  $: y1 =scaleLinear()
    .domain([32,0])
    .range([0,height /2])

  $: y2 =scaleLinear()
    .domain([0,32])
    .range([height/2,height])

  $: lineGenerator1 =line<Point2D>()
    .x(d => x(d.x))
    .y(d => y1(d.y))
    .curve(curve)

  $: lineGenerator2 =line<Point2D>()
    .x(d => x(d.x))
    .y(d => y2(d.y))
    .curve(curve)

  $: d =(lineGenerator1(optimized)! +lineGenerator2(optimized)!).replace(/\.\d+/g,"")

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
        <div>
          <svg viewBox="0 0 {width} {height}">
            <path {d} fill="#fff" />
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

