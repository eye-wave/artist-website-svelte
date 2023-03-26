<script lang="ts">  
  import { onMount } from "svelte"
  import PlayIcon from "virtual:icons/material-symbols/play-circle-rounded"
  import PauseIcon from "virtual:icons/mingcute/pause-circle-fill"
  import OpenIcon from "virtual:icons/material-symbols/open-in-new-rounded"
  import { musicPlayer } from "./MusicPlayer.svelte"
  import { PLAYER_STATE } from "./music_player"
  import Tag from "./Tag.svelte"

  export let playlist:string[]
  export let audioId:string
  export let metadata:{
    title: string,
    description: string
    imageId:string,
    timestamp: number,
    artists: string[],
    tags: string[],
  }

  let figure:HTMLElement
  let isJavascriptEnabled =false

  onMount(() => {
    isJavascriptEnabled =true

    const observer =new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if ( !entry.isIntersecting ) return
        observer.unobserve(entry.target)

        const images =[...entry.target.getElementsByTagName("img")] as HTMLImageElement[]
        const sources =[...entry.target.getElementsByTagName("source")] as HTMLSourceElement[]
        const pictures =[...entry.target.getElementsByTagName("picture")] as HTMLPictureElement[]

        pictures.forEach(pic => pic.removeAttribute("style"))

        images.forEach(img => {
          img.src =img.dataset.src || ""
          img.removeAttribute("data-src")
          img.removeAttribute("style")
        })
        
        sources.forEach(src => {
          src.srcset =src.dataset.src || ""
          src.removeAttribute("data-src")
        })

      })
    },{ threshold: 0 })

    observer.observe(figure)
  })


  const { playerStateStore, currentTrackStore } =musicPlayer.stores

  async function handlePlayButton() {
    if ( !musicPlayer.isInitialized ) await musicPlayer.initialize()
    if ( musicPlayer.queueLength < 1 ) musicPlayer.loadQueue(playlist)
    if ( $currentTrackStore?.audioId === audioId ) {
      if ( $playerStateStore === PLAYER_STATE.idle ) return musicPlayer.replay()
      if ( $playerStateStore !== PLAYER_STATE.playing ) return musicPlayer.resume()
      return musicPlayer.pause()
    }

    musicPlayer.play(audioId)
  }

  // TODO lazy loading for images

</script>

<figure bind:this={figure}>
  <figcaption>{ metadata.title }</figcaption>
  
  <picture style:display="none">
    <source media="(min-width:480px)"
      data-src="http://localhost:3000/storage/file/{metadata.imageId}?width=384&height=384">
    <img 
      data-src="http://localhost:3000/storage/file/{metadata.imageId}?width=193&height=192"
      alt="" draggable="false"/>
  </picture>

  <noscript>
    <picture>
      <source srcset="http://localhost:3000/storage/file/{metadata.imageId}?width=384&height=384"
        media="(min-width:480px)">
      <img src="http://localhost:3000/storage/file/{metadata.imageId}?width=193&height=192"
        alt="" draggable="false"/>
    </picture>
  </noscript>

  <a class="absolute right-2 top-2 z-10" href="/song/{audioId}">
    <OpenIcon />
  </a>

  <ul class="relative text-primary-300 flex gap-2 pl-2 mr-24 flex-wrap items-baseline justify-start">
    {#each metadata.tags as tag}
      <Tag>{tag}</Tag>
    {/each}
  </ul>
    
  {#if isJavascriptEnabled}
    <button on:click={handlePlayButton}
      class="text-primary-400 text-6xl absolute bottom-1 right-1">
      
      {#if audioId === $currentTrackStore?.audioId && $playerStateStore === PLAYER_STATE.playing }
        <PauseIcon />
      {:else}
        <PlayIcon />
      {/if}
    </button>
  {/if}
</figure>

<style lang="postcss">
  figure {
    @apply w-96 h-96;
    @apply flex-shrink-0 relative;
    @apply bg-cover text-white;
    @apply rounded-md shadow-md;
    overflow: hidden;
    user-select: none
  }

  img {
    @apply w-full h-full inset-0 absolute;
    @apply bg-cover bg-center;
    z-index: 0;
    filter: brightness(60%);
    transition: filter 120ms ease-out;
  }

  figure:hover img {
    filter: brightness(100%);
  }

  figcaption {
    z-index: 1;
    @apply relative p-2;
    @apply text-2xl text-center;
    text-shadow: 2px 2px 10px #000;
  }

  @media screen and (max-width: 890px) {
    figure { @apply w-64 h-64 }
  }

  @media screen and (max-width: 480px) {
    figure { @apply w-52 h-52 }
    figcaption { @apply text-sm }
  }
</style>