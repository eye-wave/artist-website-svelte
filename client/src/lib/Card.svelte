<script lang="ts">  
  import { onMount } from "svelte"
  import { PUBLIC_DB_URL } from "$env/static/public" 

  export let img:string
  export let title:string

  let enteredViewport =false
  let figure:HTMLElement

  onMount(() => {
    const observer =new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if ( !entry.isIntersecting ) return
        observer.unobserve(entry.target)
        enteredViewport =true
      })
    },{ threshold: 0 })

    observer.observe(figure)
  })
  
</script>

<figure bind:this={figure}>
  <figcaption> { title } </figcaption>
  
  {#if enteredViewport}
    <slot name="image">
      <picture>
        <source media="(min-width:480px)" srcset="{PUBLIC_DB_URL}/storage/file/{img}?width=384&height=384">
        <img src="{PUBLIC_DB_URL}/storage/file/{img}?width=192&height=192" alt=""/>
      </picture>
    </slot>
  {:else}
    <noscript>
      <slot name="image">
        <picture>
          <source media="(min-width:480px)" srcset="{PUBLIC_DB_URL}/storage/file/{img}?width=384&height=384">
          <img src="{PUBLIC_DB_URL}/storage/file/{img}?width=192&height=192" alt=""/>
        </picture>
      </slot>
    </noscript>
  {/if}
  <slot />
</figure>

<style lang="postcss">
  figure {
    @apply w-96 h-96;
    @apply flex-shrink-0 relative;
    @apply bg-cover text-white;
    @apply rounded-md shadow-md;
    overflow: hidden;
    user-select: none
  }

  img {
    @apply w-full h-full inset-0 absolute;
    @apply bg-cover bg-center;
    z-index: 0;
  }

  figcaption {
    z-index: 1;
    @apply relative p-2;
    @apply text-2xl text-center;
    text-shadow: 2px 2px 10px #000;
  }

  @media screen and (max-width: 480px) {
    figure {
      @apply w-52 h-52;
    }
  }
</style>