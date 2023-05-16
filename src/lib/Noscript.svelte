<noscript>
  <div class="noscript-tag">
    <slot>Javascript is disabled</slot>
  </div>
</noscript>

<style lang="postcss">
  div {
    @apply fixed inset-0 z-10 h-fit w-full py-1;
    @apply bg-white/20 text-center text-sm font-semibold text-white/70 shadow-md;
  }
</style>
