<script lang="ts">
  import "./styles.css"
  import { isMusicPlayerInitialized } from "~/stores/isMusicPlayerInitialized"
  import Footer from "$lib/navigation/Footer.svelte"
  import Navbar from "$lib/navigation/Navbar.svelte"
  import { navigating } from "$app/stores"

  type MusicPlayerType = typeof import("$lib/music_player/MusicPlayerBase.svelte").default

  let MusicPlayer: MusicPlayerType

  $: {
    if ($isMusicPlayerInitialized) {
      import("$lib/music_player/MusicPlayerBase.svelte").then(_module => (MusicPlayer = _module.default))
    }
  }
</script>

<Navbar />
{#if $navigating}
  <div class="loading" />
{/if}

<main class="min-h-screen flex-col px-[4vmin]">
  <slot />
</main>

{#if $isMusicPlayerInitialized && MusicPlayer}
  <svelte:component this={MusicPlayer} />
{/if}

<Footer />

<style lang="postcss">
  .loading {
    @apply h-1 w-full;
    @apply bg-gradient-to-r from-transparent via-primary-600 to-transparent;
    animation: loading 1.2s linear infinite;
  }

  @keyframes loading {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }
</style>
