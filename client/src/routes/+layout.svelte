<script lang="ts">
  import Footer from "src/lib/navigation/Footer.svelte"
  import Navbar from "src/lib/navigation/Navbar.svelte"
  import { onDestroy, onMount, type ComponentType } from "svelte"
  import "./styles.css"
  import "$lib/screenEffects.css"
  import { isMusicPlayerInitialized } from "src/stores/isMusicPlayerInitialized"

  let isJavascriptEnabled =false
  onMount(() => isJavascriptEnabled =true)
  
  let loadMusicPlayerPromise:Promise<{default:ComponentType}>
  const unsubscribe =isMusicPlayerInitialized.subscribe(val => {
    if ( val ) {
      loadMusicPlayerPromise =import("$lib/music_player/MusicPlayerBase.svelte")
    }
  })

  onDestroy(unsubscribe)

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