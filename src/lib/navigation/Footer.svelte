<script lang="ts">
  import { PUBLIC_REPO_URL, PUBLIC_SOUNDCLOUD_URL, PUBLIC_YOUTUBE_URL } from "$env/static/public"
  import GithubIcon from "virtual:icons/mdi/github"
  import SoundCloudIcon from "virtual:icons/grommet-icons/soundcloud"
  import YoutubeIcon from "virtual:icons/mdi/youtube"

  const links = [
    {
      href: PUBLIC_REPO_URL,
      Component: GithubIcon,
      caption: "[Source Code]",
    },
    {
      href: PUBLIC_YOUTUBE_URL,
      Component: YoutubeIcon,
      caption: "[Youtube]",
    },
    {
      href: PUBLIC_SOUNDCLOUD_URL,
      Component: SoundCloudIcon,
      caption: "[Soundcloud]",
    },
  ]
</script>

<footer class="relative bg-black p-10 text-center">
  <div class="flex justify-center gap-2 text-3xl">
    {#each links as { href, caption, Component }}
      <a {href} target="_blank">
        {caption}
        <Component class="text-3xl" />
      </a>
    {/each}
  </div>
  <p class="text-sm">
    made by _eyewave
    <span class="text-xs text-primary-200">&#169; 2023</span>
  </p>
</footer>

<style lang="postcss">
  a {
    @apply flex flex-col items-center;
    @apply text-xs transition-colors hover:text-primary-400;
  }
</style>
