<script lang="ts">
  import { artistMap } from "~/stores/artists"
  import { createEventDispatcher, onMount, onDestroy, type SvelteComponent } from "svelte"
  import { fade, fly } from "svelte/transition"
  import { formatSeconds } from "~/utils/time"
  import { QUEUE_STATE, QUEUE_STATE_NAMES, type T_QUEUE_STATE } from "./enums"
  import ArrowDownIcon from "virtual:icons/ic/round-keyboard-arrow-down"
  import AudioGraph from "./audio_effects/AudioGraph.svelte"
  import CogIcon from "virtual:icons/ic/round-settings"
  import Marquee from "svelte-fast-marquee"
  import NextIcon from "virtual:icons/basil/skip-next-solid"
  import NoteIcon from "virtual:icons/solar/music-note-bold"
  import PrevIcon from "virtual:icons/basil/skip-prev-solid"
  import ShuffleIcon from "virtual:icons/ph/shuffle-bold"
  import ShuffleOffIcon from "virtual:icons/tabler/arrows-right"
  import Slider from "../Slider.svelte"

  let MoodSwitcher: SvelteComponent
  let PlaybackSpeed: SvelteComponent
  let Reverb: SvelteComponent
  let Waveshaper: SvelteComponent

  $: {
    if (isSettingsTabOpen) {
      if (!MoodSwitcher) import("./audio_effects/MoodSwitcher.svelte").then(module => (MoodSwitcher = module.default))
      if (!PlaybackSpeed) import("./audio_effects/PlaybackSpeed.svelte").then(module => (PlaybackSpeed = module.default))
      if (!Reverb) import("./audio_effects/Reverb.svelte").then(module => (Reverb = module.default))
      if (!Waveshaper) import("./audio_effects/Waveshaper.svelte").then(module => (Waveshaper = module.default))
    }
  }

  export let artists: string[]
  export let currentTime: number
  export let duration: number
  export let handleNextButton: () => void
  export let handlePlayButton: () => void
  export let handlePrevButton: () => void
  export let handleQueueButton: () => void
  export let handleShuffleButton: () => void
  export let handleSongSkip: (e: CustomEvent) => void
  export let image: string
  export let playerComponent: typeof SvelteComponent
  export let queueComponent: typeof SvelteComponent
  export let queueState: T_QUEUE_STATE
  export let shuffleOn: boolean
  export let title: string
  export let windowWidth: number

  const dispatch = createEventDispatcher<{ close: void }>()
  const handleClose = () => dispatch("close")

  let isSettingsTabOpen = false
  let playButton: HTMLButtonElement

  onMount(() => {
    playButton?.focus()
    document.documentElement.style.overflow = "hidden"
  })

  onDestroy(() => {
    document.documentElement.style.removeProperty("overflow")
  })

  // TODO lazy load effect panel
</script>

<div transition:fade class="fixed inset-0 h-full w-full bg-neutral-800/80" />

<div transition:fly={{ y: 20 }} class="full-screen">
  <button class="absolute left-2 top-2 h-12 text-center text-4xl" on:click={handleClose}>
    <ArrowDownIcon />
  </button>

  {#key isSettingsTabOpen}
    <button
      transition:fly={{ y: 5 }}
      class="absolute right-2 top-2 h-12 text-center text-2xl"
      on:click={() => (isSettingsTabOpen = !isSettingsTabOpen)}
    >
      {#if isSettingsTabOpen}
        <NoteIcon />
      {:else}
        <CogIcon />
      {/if}
    </button>
  {/key}

  {#if isSettingsTabOpen}
    <div in:fly|local={{ x: -10, delay: 300 }} out:fly|local={{ x: -10 }} class="h-full w-full py-20">
      <svelte:component this={MoodSwitcher} />
      <svelte:component this={PlaybackSpeed} />
      <svelte:component this={Reverb} color="#50aaff" />
      <svelte:component this={Waveshaper} color="#de8098" />
    </div>
  {:else}
    <div
      in:fly|local={{ x: -10, delay: 300 }}
      out:fly|local={{ x: -10 }}
      class="flex h-full flex-col items-center justify-evenly gap-1"
    >
      <div>
        <div class="mx-auto my-2 flex justify-center">
          <AudioGraph />
        </div>

        <div class="relative" style:width="{windowWidth < 480 ? 224 : 384}px" style:height="{windowWidth < 480 ? 224 : 384}px">
          {#key image}
            <picture>
              <source media="(min-width:480px)" srcset="/api/storage/file/{image}?width=384&height=384" />
              <img
                transition:fly|local={{ x: -10 }}
                src="/api/storage/file/{image}?width=224&height=224"
                class="absolute inset-0 rounded-md"
                draggable="false"
                alt=""
              />
            </picture>
          {/key}
        </div>
      </div>

      <div class="relative flex h-20 w-full flex-col items-center overflow-hidden px-4">
        {#key title}
          <div class="absolute inset-0">
            <Marquee direction="left" speed={title.length > (windowWidth - 30) / 20 ? 50 : 0}>
              <h1 transition:fly|local={{ x: 10 }} class="mx-10 w-full text-center font-title">
                {title}
              </h1>
            </Marquee>
          </div>
        {/key}

        <ul class="my-10 flex flex-wrap gap-3">
          {#each artists as artist (artist)}
            <a
              href={artistMap.get(artist)?.link || ""}
              target="_blank"
              out:fly|local={{ x: 10 }}
              in:fly={{ x: -10 }}
              class="ml-1 text-xs">{artist}</a
            >
          {/each}
        </ul>
      </div>

      <div class="w-full max-w-xl">
        <Slider on:change={handleSongSkip} max={duration} value={currentTime} />
        <div class="-mt-5 flex w-full items-center justify-between">
          <span>{formatSeconds(currentTime)}</span>
          <span>{formatSeconds(duration)}</span>
        </div>
      </div>

      <div class="flex w-full max-w-xl justify-evenly px-4 text-2xl sm:text-4xl">
        <button on:click={handleQueueButton}>
          <abbr title={QUEUE_STATE_NAMES.get(queueState)}>
            <svelte:component this={queueComponent} class={queueState === QUEUE_STATE.LOOPOFF ? "-rotate-90" : ""} />
          </abbr>
        </button>

        <button on:click={handlePrevButton}>
          <PrevIcon />
        </button>

        <button bind:this={playButton} class="text-4xl sm:text-6xl" on:click={handlePlayButton}>
          <svelte:component this={playerComponent} />
        </button>

        <button on:click={handleNextButton}>
          <NextIcon />
        </button>

        <button on:click={handleShuffleButton}>
          {#if shuffleOn}
            <ShuffleIcon class="text-primary-400" />
          {:else}
            <ShuffleOffIcon />
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .full-screen {
    @apply fixed inset-0 z-10 m-4 overflow-hidden p-4;
    @apply select-none;
    @apply rounded-md bg-black;
  }
</style>
