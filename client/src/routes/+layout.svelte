<script lang="ts">
  import Footer from "src/lib/Footer.svelte"
  import MusicPlayer, { musicPlayer } from "src/lib/MusicPlayer.svelte"
  import Navbar from "src/lib/Navbar.svelte"
  import { onMount } from "svelte"
  import "./styles.css"
  import "$lib/screenEffects.css"

  let isJavascriptEnabled =false
  onMount(() => isJavascriptEnabled =true)

  const { isInitializedStore } =musicPlayer.stores

</script>

<Navbar />
<slot />

{#if isJavascriptEnabled && $isInitializedStore}
  <MusicPlayer />
{/if}
<Footer />