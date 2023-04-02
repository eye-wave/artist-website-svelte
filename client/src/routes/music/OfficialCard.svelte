<script lang="ts">  
  import { PUBLIC_DB_URL } from "$env/static/public"
  import Card from "$lib/Card.svelte"
  import SoundCloudIcon from "virtual:icons/grommet-icons/soundcloud"
  import SpotifyIcon from "virtual:icons/ph/spotify-logo-fill"
  import YoutubeIcon from "virtual:icons/fe/youtube"

  export let title: string
  export let image: string
  export let link: {
    soundcloud?: string
    youtube?: string
    spotify?: string
  }

  const links =[
    {
      exists: !!link.soundcloud,
      Component: SoundCloudIcon,
      href: "https://soundcloud.com/" +link.soundcloud,
      platform: "Soundcloud",
    },
    {
      exists: !!link.youtube,
      Component: YoutubeIcon,
      href: "https://soundcloud.com/" +link.soundcloud,
      platform: "Youtube",
    },
    {
      exists: !!link.spotify,
      Component: SpotifyIcon,
      href: "https://open.spotify.com/track/" +link.soundcloud,
      platform: "Spotify",
    },
  ]


  // TODO SUGGESTION use scrapers / apis to get total views count for each song
</script>

<Card {title} img={image}>
  <picture slot="image">
    <source media="(min-width:480px)" srcset="{PUBLIC_DB_URL}/storage/file/{image}?width=384&height=384">
    <img src="{PUBLIC_DB_URL}/storage/file/{image}?width=192&height=192" alt=""/>
  </picture>
  
  <div class="card-icons">
    {#each links as {href,Component,exists,platform}}
      {#if exists}
        <a {href} target="_blank" aria-label="Play {title} on {platform}">
          <Component />
        </a>
      {/if}
    {/each}
  </div>
</Card>

<style lang="postcss">
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
    &:hover {
      filter: blur(0) brightness(100%)
    }
  }

  @media (hover: none) {
    img {
      filter: blur(0) brightness(100%);
    }
  }
</style>