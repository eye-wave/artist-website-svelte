<noscript>
  <div>
    <slot>Javascript is disabled</slot>
  </div>
</noscript>

<style lang="postcss">
  div {
    @apply fixed top-0 z-10 w-full px-[4vmin] py-1;
    @apply bg-white/20 text-xl font-semibold text-white/70 shadow-md;
  }
</style>
