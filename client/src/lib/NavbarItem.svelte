<script lang="ts">
  import { page } from "$app/stores"
  export let href:string
  export let name:string
  export let active =false

</script>

<a
  class="select-none relative {$$props.class}"
  class:active {href}>
  {name}
</a>

<style lang="postcss">
  a::after {
    content:"";
    height: 1px;
    @apply w-full absolute bottom-0 left-0;
    @apply transition-transform;
    @apply bg-current;
    transform: scale(0,1);
  }

  .active,
  a:hover,
  a:focus {
    outline: transparent;
    &::after {
      transform: scale(1);
    }
  }
</style>