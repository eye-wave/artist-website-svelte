<script lang="ts">
  export let active = false
  export let href: string
  export let label = ""
</script>

<a aria-label={label} class="relative select-none {$$props.class || ''}" class:active {href}>
  <slot>link</slot>
</a>

<style lang="postcss">
  a::after {
    content: "";
    height: 1px;
    @apply absolute bottom-0 left-0 w-full;
    @apply transition-transform;
    @apply bg-current;
    transform: scale(0, 1) translateY(10px);
  }

  .active,
  a:hover,
  a:focus {
    outline: transparent;
    &::after {
      transform: scale(1) translateY(10px);
    }
  }
</style>
