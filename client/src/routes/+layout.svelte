<script lang="ts">
  import "./styles.css"
  import "$lib/screenEffects.css"
  import { isMusicPlayerInitialized } from "src/stores/isMusicPlayerInitialized"
  import Footer from "$lib/navigation/Footer.svelte"
  import Navbar from "$lib/navigation/Navbar.svelte"

  type ComponentType =typeof import("$lib/music_player/MusicPlayerBase.svelte")

  let loadMusicPlayerPromise:Promise<ComponentType>

  $: {
    if ( $isMusicPlayerInitialized ) {
      loadMusicPlayerPromise =import("$lib/music_player/MusicPlayerBase.svelte")
    }
  }

</script>

<Navbar />
<slot />

{#if $isMusicPlayerInitialized}
  {#await loadMusicPlayerPromise}
  {:then { default: Component }} 
    <Component />
  {/await}
{/if}
<Footer />