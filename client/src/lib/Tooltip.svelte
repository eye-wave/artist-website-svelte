<div class="tooltip-container{$$props.class ? " "+$$props.class : ""}">
  <div class="tooltip">
    <slot name="tooltip">This is a tooltip</slot>
  </div>
  <slot />
</div>

<style lang="postcss">
  
  .tooltip-container {
    @apply relative;
    &:hover .tooltip {
      @apply opacity-100 scale-100;
      pointer-events: auto;
    }
  }

  .tooltip {
    @apply w-fit px-2 py-1 rounded-md;
    @apply absolute -translate-y-full scale-75;
    opacity: 0;
    transition: all 200ms;
    pointer-events: none;
    transform-origin: bottom;

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