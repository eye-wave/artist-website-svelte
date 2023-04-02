<script lang="ts">
  import { fade } from "svelte/transition"
  import { glitch } from "src/transitions/glitch"
  import { onMount } from "svelte"
  import { PUBLIC_SOUNDCLOUD_URL, PUBLIC_SPOTIFY_URL, PUBLIC_YOUTUBE_URL } from "$env/static/public"
  import { typewriter } from "src/transitions/typewriter"
  import { viewport } from "src/actions/viewport"
  import CdIcon from "virtual:icons/clarity/cd-dvd-line"
  import Head from "$lib/Head.svelte"
  import OfficialCard from "./OfficialCard.svelte"
  import type { ReleaseEntry } from "./+page.server"

  export let data

  const { releases } =data

  type Group ={
    active: boolean,
    top: boolean,
    bottom: boolean,
    year: number,
    oldestMonth: string,
    newestMonth: string,
    items: ReleaseEntry[]
  }
  
  const songGroups:Group[] =[]
  
  releases?.forEach(r => {
    const date =new Date(r.timestamp *1000)
    const year =date.getFullYear()

    let [ group ] =songGroups.filter(g => g.year === year)
    if ( !group ) {
      group ={ year, items: [r] } as Group
      songGroups.push( group )
      return
    }

    group.items.push(r)
  })

  const groupedByYear =songGroups.map(g => {
    const sorted =g.items.sort((a,b) => a.timestamp -b.timestamp).reverse()
    const oldest =Math.min(...sorted.map(s => s.timestamp))
    const newest =Math.max(...sorted.map(s => s.timestamp))

    const formater =new Intl.DateTimeFormat("en-GB",{ month: "long" })
    const oldestMonth =formater.format(oldest *1000)
    const newestMonth =formater.format(newest *1000)

    return { ...g, oldestMonth, newestMonth, active: true, top: false, bottom: true }
  }).reverse()

  onMount(() => groupedByYear.forEach(g => g.active =false))

  // TODO fix animation bugs on scroll
  // TODO add sort by oldest / newest
</script>

<Head title="Demo Songs"></Head>

<main>
  <section class="text-xl px-[10vmin] text-center select-none mb-96 mt-52 font-semibold text-neutral-400">
    <p class="max-w-3xl mx-auto">
      <span class="font-title text-primary-400 text-4xl inline-flex gap-1"> <CdIcon /> Discography</span> <br>
      Find all of my released songs right here, going back to 2019 and beyond!
      Most of them are released on <a href={PUBLIC_SOUNDCLOUD_URL} target="_blank" class="text-orange-400 font-title text-2xl">Soundcloud</a>,
      but you can also find them on my <a href={PUBLIC_YOUTUBE_URL} target="_blank" class="text-red-400 font-title text-2xl">YouTube</a>
      channel and even on <a href={PUBLIC_SPOTIFY_URL} target="_blank" class="text-green-400 font-title text-2xl">Spotify</a>.
      And if you're still looking for more, check out my <abbr title="Work in progress">w.i.p</abbr> page.</p>
  </section>

  {#each groupedByYear as group}
    <section use:viewport
      on:enterViewport={() => group.active =true}
      on:leaveViewport={() => group.active =false}
      on:leaveFromAbove={() => {
        group.top =true
        group.bottom =false
      }}
      on:leaveFromBelow={() => {
        group.top =false
        group.bottom =true
      }}
      class:top={group.top}
      class:bottom={group.bottom}
      class:active={group.active}
      class="group">
       
      <div class="h-20 my-10 flex flex-col items-center">
        {#if group.active}
          <h2 in:glitch out:fade|local
            class="text-3xl font-title text-primary-300">
            { group.year }
          </h2>
          <h3 class="text-sm font-normal" in:typewriter out:fade|local>
            {`${group.oldestMonth} ${group.newestMonth !== group.oldestMonth ? ` - ${group.newestMonth}` : ""}`}
          </h3>
        {/if}
      </div>

      <section class="flex flex-wrap gap-10 justify-center px-10">
        {#each group.items as {image,link,title}}
          <OfficialCard {image} {link} {title} />
        {/each}
      </section>
    </section>
  {/each}
</main>

<style lang="postcss">
  .group {
    @apply opacity-0 scale-90 hue-rotate-60;
    @apply py-20 my-40 text-center;
    transition: all 1s;

    .top { @apply translate-y-20 }
    .bottom { @apply -translate-y-20 }
  }

  .active {
    @apply opacity-100 translate-y-0 scale-100 hue-rotate-0;
  }
</style>