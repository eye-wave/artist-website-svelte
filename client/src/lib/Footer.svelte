<script lang="ts">
  import GithubIcon from "virtual:icons/mdi/github"
  import YoutubeIcon from "virtual:icons/fe/youtube"
  import SoundCloudIcon from "virtual:icons/grommet-icons/soundcloud"

  const href = "https://example.com"
</script>

<footer class="bg-black p-3 relative text-center">
  <div class="flex gap-2 justify-center text-3xl">
    <a {href} target="_blank" class="flex items-center gap-2 hover:text-primary-400 transition-colors">
      <div class="flex flex-col items-center">
        <span
          class="text-xs font-mono">[Source Code]</span>
        <span><GithubIcon /></span>
      </div>
    </a>

    
    <a {href} target="_blank" class="flex items-center gap-2 hover:text-primary-400 transition-colors">
      <div class="flex flex-col items-center">
        <span
          class="text-xs font-mono">[Youtube]</span>
        <span><YoutubeIcon /></span>
      </div>
    </a>

    <a {href} target="_blank" class="flex items-center gap-2 hover:text-primary-400 transition-colors">
      <div class="flex flex-col items-center">
        <span
          class="text-xs font-mono">[Soundcloud]</span>
        <span><SoundCloudIcon /></span>
      </div>
    </a>
  </div>  
  <p class="text-sm">
    made by _eyewave
    <span class="text-xs text-primary-200">&#169; 2023</span>
  </p>
</footer>
