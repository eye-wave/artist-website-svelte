<script lang="ts">  
  import PlayIcon from "virtual:icons/material-symbols/play-circle-rounded"
  import PauseIcon from "virtual:icons/mingcute/pause-circle-fill"
  import { musicPlayer } from "./MusicPlayer.svelte"
  import { PLAYER_STATE } from "./music_player"

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

  const { playerStateStore, currentTrackStore } =musicPlayer.stores

  async function handlePlayButton() {
    if ( !musicPlayer.isInitialized ) await musicPlayer.initialize()
    musicPlayer.loadQueue(playlist)
    musicPlayer.play( audioId )
  }

</script>

<figure>
  <picture>
    <source media="(min-width:480px)" srcset="http://localhost:3000/storage/file/{metadata.imageId}?width=384&height=384">
    <img src="http://localhost:3000/storage/file/{metadata.imageId}?width=192&height=192" alt=""/>
  </picture>

  <figcaption>{ metadata.title }</figcaption>

  <div class="relative">
    
    <button on:click={handlePlayButton}
      class="text-primary-400 text-6xl">
      
      {#if audioId === $currentTrackStore?.audioId && $playerStateStore === PLAYER_STATE.playing }
        <PauseIcon />
      {:else}
        <PlayIcon />
      {/if}
    </button>

  </div>
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
    filter: blur(3px) brightness(60%);
    transition: filter 120ms ease-out;
  }

  figure:hover img {
    filter: blur(0) brightness(100%);  
  }

  figcaption {
    @apply relative p-2;
    @apply text-2xl text-center;
    text-shadow: 2px 2px 10px #000;
  }

  @media (hover: none) {
    img {
      filter: blur(0) brightness(100%);
    }
  }

  @media screen and (max-width: 480px) {
    figure {
      @apply w-52 h-52;
    }
  }
</style>