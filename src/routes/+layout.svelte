<script lang="ts">
  import "./styles.css"
  import "$lib/screenEffects.css"
  import { isMusicPlayerInitialized } from "src/stores/isMusicPlayerInitialized"
  import Footer from "$lib/navigation/Footer.svelte"
  import Navbar from "$lib/navigation/Navbar.svelte"

  type MusicPlayerType = typeof import("$lib/music_player/MusicPlayerBase.svelte").default

  let MusicPlayer: MusicPlayerType

  $: {
    if ($isMusicPlayerInitialized) {
      import("$lib/music_player/MusicPlayerBase.svelte").then(_module => (MusicPlayer = _module.default))
    }
  }
</script>

<Navbar />

<main class="flex-1 flex-col px-[4vmin]">
  <slot />
</main>

{#if $isMusicPlayerInitialized && MusicPlayer}
  <svelte:component this={MusicPlayer} />
{/if}
<Footer />
