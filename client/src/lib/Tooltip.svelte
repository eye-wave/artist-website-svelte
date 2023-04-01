<script lang="ts">
	export let color ="#59a"

</script>

<div class="tooltip-container{$$props.class ? " "+$$props.class : ""}" style="--c:{color}">
  <div class="tooltip">
    <slot name="tooltip">This is a tooltip</slot>
  </div>
  <slot />
</div>

<style lang="postcss">
  
  .tooltip-container {
    @apply relative;
    &:hover .tooltip {
      @apply opacity-100 scale-100 -translate-y-3;
    }
  }

  .tooltip {
    @apply w-fit px-2 py-1 rounded-md;
    @apply translate-y-3 scale-75;
    opacity: 0;
    background-color: var(--c);
    transition: all 200ms;
    pointer-events: none;

    &::after {
      content: "";
      @apply absolute w-0 h-0 bottom-0;
      border: 10px solid transparent;
      border-top-color: var(--c);
      left: 50%;
      transform: translate(-50%,20px);
    }
  }

</style>