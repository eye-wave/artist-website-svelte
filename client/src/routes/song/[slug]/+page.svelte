<script lang="ts">
  import { parsePost } from "./parser"
  import { PUBLIC_DB_URL } from "$env/static/public"
  import Tag from "$lib/Tag.svelte"
  
  export let data  
  
  const { song, post } =data

</script>

<main class="px-[4vmin] flex flex-col md:flex-row gap-5 flex-1">
  <picture>
    <source media="(min-width:480px)" srcset="{PUBLIC_DB_URL}/storage/file/{song.metadata.imageId}?width=384&height=384">
    <img class="rounded-sm mx-auto"
      src="{PUBLIC_DB_URL}/storage/file/{song.metadata.imageId}?width=192&height=192" alt=""/>
  </picture>
  
  <section class="font-semibold text-neutral-400 text-xl">
    <h1 class="mb-3 font-title text-primary-400">
      <span class="text-xs text-neutral-500">T.</span>
      {song.metadata.title}
    </h1>
    
    <p class="my-8 max-w-2xl">
      <span class="text-xs text-neutral-500">D.</span>
      {@html parsePost(post)}
    </p>
    
    <p class="my-8">
      <span class="text-xs text-neutral-500">A.</span>
      {#each song.metadata.artists as artist}
        <span class="mx-2 text-neutral-300 bg-neutral-900 px-2 py-1 rounded-md">{artist}</span>
      {/each}
    </p>
    
    <div class="my-8 max-w-sm flex flex-wrap gap-2">
      <span class="text-xs text-neutral-500">#.</span>
      {#each song.metadata.tags as tag}
        <Tag class="text-primary-200 bg-primary-900">{tag}</Tag>
      {/each}
    </div>


  </section>
</main>

<style lang="postcss">
  
  
</style>