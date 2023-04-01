<noscript>
  <div>
    <slot>Javascript is disabled</slot>
  </div>
</noscript>

<style lang="postcss">
  div {
    @apply fixed top-0 w-full px-[4vmin] py-1 z-10;
    @apply bg-white/20 text-white/70 text-xl font-semibold shadow-md;
  }
</style>