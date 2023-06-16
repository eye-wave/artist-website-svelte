<script lang="ts">
  import { PUBLIC_SOUNDCLOUD_URL, PUBLIC_YOUTUBE_URL, PUBLIC_SPOTIFY_URL } from "$env/static/public"
  import Head from "$lib/Head.svelte"
  import SoundCloudIcon from "virtual:icons/grommet-icons/soundcloud"
  import YoutubeIcon from "virtual:icons/mdi/youtube"
  import SpotifyIcon from "virtual:icons/mdi/spotify"

  const description = `
Eyewave is a ${new Date().getFullYear() - 2004} year old producer from Poland 🇵🇱.
His style consists of Dubstep, spiced with a pinch of 🌈Color Bass, baked on a coat of jazz 🎷 and lofi 😺, served with melodic sauce (saws).`.trim()

  const links = [
    {
      href: PUBLIC_YOUTUBE_URL,
      Component: YoutubeIcon,
      caption: "Youtube",
    },
    {
      href: PUBLIC_SOUNDCLOUD_URL,
      Component: SoundCloudIcon,
      caption: "Soundcloud",
    },
    {
      href: PUBLIC_SPOTIFY_URL,
      Component: SpotifyIcon,
      caption: "Spotify",
    },
  ]
</script>

<Head title="Eyewave" {description} />

<div class="mx-auto mt-10 flex max-w-xl flex-col items-center gap-4">
  <img class="rounded-full" src="/avatar.webp" alt="" draggable="false" />
  <p class="text-center text-xl font-semibold text-neutral-400">{description}</p>

  <ul class="mt-32 w-full">
    {#each links as { href, Component, caption }}
      <li class="my-8 rounded-full bg-black shadow-md transition-transform hover:scale-105">
        <a {href} target="_blank" class="grid grid-cols-3 items-center p-2 px-5 text-5xl">
          <Component />
          <div class="text-center text-xl">{caption}</div>
        </a>
      </li>
    {/each}
  </ul>
</div>
