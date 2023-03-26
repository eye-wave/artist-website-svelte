<script lang="ts">  
  import SoundCloudIcon from "virtual:icons/grommet-icons/soundcloud"
  import SpotifyIcon from "virtual:icons/ph/spotify-logo-fill"
  import YoutubeIcon from "virtual:icons/fe/youtube"
  import { onMount } from "svelte"

  export let id: number
  export let artists: string[]
  export let title: string
  export let link: {
      soundcloud?: string
      youtube?: string
      spotify?: string
  }
  export let image: string
  export let timestamp: number

  let figure:HTMLElement
  onMount(() => {
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



  // TODO add sort by oldest / newest
  // TODO SUGGESTION use scrapers / apis to get total views count for each song

</script>

<figure bind:this={figure}>
  <figcaption> { title } </figcaption>
  
  <picture style:display="none">
    <source media="(min-width:480px)" data-src="http://localhost:3000/storage/file/{image}?width=384&height=384">
    <img data-src="http://localhost:3000/storage/file/{image}?width=192&height=192" alt=""/>
  </picture>
  
  <noscript>
    <picture>
      <source media="(min-width:480px)" srcset="http://localhost:3000/storage/file/{image}?width=384&height=384">
      <img src="http://localhost:3000/storage/file/{image}?width=192&height=192" alt=""/>
    </picture>
  </noscript>

  <div class="card-icons">
    
    {#if link.soundcloud }
      {@const href ="https://soundcloud.com" +link.soundcloud}
      
      <a {href} target="_blank">
        <SoundCloudIcon />
      </a>
    {/if}

    {#if link.youtube }
      {@const href ="https://youtu.be/" +link.youtube}
      
      <a {href} target="_blank">
        <YoutubeIcon />
      </a>
    {/if}

    {#if link.spotify }
      {@const href ="https://open.spotify.com/track/" +link.spotify}
      
      <a {href} target="_blank">
        <SpotifyIcon />
      </a>
    {/if}

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

  .card-icons {
    @apply absolute bottom-0 px-3 py-2;
    @apply text-3xl;
    @apply flex gap-1;
    @apply text-primary-500
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
    z-index: 1;
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