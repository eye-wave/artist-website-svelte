<script lang="ts">
  import { viewport } from "src/actions/viewport"

  export let img: string
  export let title: string

  let enteredViewport = false
</script>

<figure use:viewport on:enterViewport={() => (enteredViewport = true)}>
  <figcaption>{title}</figcaption>

  {#if enteredViewport}
    <slot name="image">
      <picture>
        <source media="(min-width:480px)" srcset="/api/storage/file/{img}?width=384&height=384" />
        <img draggable="false" src="/api/storage/file/{img}?width=192&height=192" alt="" />
      </picture>
    </slot>
  {:else}
    <noscript>
      <slot name="image">
        <picture>
          <source media="(min-width:480px)" srcset="/api/storage/file/{img}?width=384&height=384" />
          <img draggable="false" src="/api/storage/file/{img}?width=192&height=192" alt="" />
        </picture>
      </slot>
    </noscript>
  {/if}
  <slot />
</figure>

<style lang="postcss">
  figure {
    @apply h-96 w-96;
    @apply relative flex-shrink-0;
    @apply bg-cover text-white;
    @apply rounded-md shadow-md;
    overflow: hidden;
    user-select: none;
  }

  img {
    @apply absolute inset-0 h-full w-full;
    @apply bg-cover bg-center;
    z-index: 0;
  }

  figcaption {
    z-index: 1;
    font-size: clamp(14px, 3vmin, 24px);
    @apply relative p-2;
    @apply text-center;
    text-shadow: 2px 2px 10px #000;
  }

  @media screen and (max-width: 480px) {
    figure {
      @apply h-52 w-52;
    }
  }
</style>
