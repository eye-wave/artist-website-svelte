<script lang="ts">
  import GithubIcon from "virtual:icons/mdi/github"
  import SoundCloudIcon from "virtual:icons/grommet-icons/soundcloud"
  import YoutubeIcon from "virtual:icons/mdi/youtube"

  const links =[
    {
      href: "https://example.com",
      Component: GithubIcon,
      caption: "[Source Code]"
    },
    {
      href: "https://example.com",
      Component: YoutubeIcon,
      caption: "[Youtube]"
    },
    {
      href: "https://example.com",
      Component: SoundCloudIcon,
      caption: "[Soundcloud]"
    },
  ]
  
</script>

<footer class="bg-black p-3 relative text-center">
  <div class="flex gap-2 justify-center text-3xl">
    {#each links as {href,caption,Component}}
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
    @apply flex items-center flex-col;
    @apply hover:text-primary-400 transition-colors text-xs font-mono;
  }
</style>
