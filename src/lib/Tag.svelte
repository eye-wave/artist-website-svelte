<script lang="ts">
  export let dot = true
</script>

<li class="flex w-fit items-center gap-1 bg-black/50 px-2 rounded-full{$$props.class ? ' ' + $$props.class : ''}">
  {#if dot}
    <div class="h-2 w-2 rounded-full bg-current" />
  {/if}
  <span class="text-sm">
    <slot>#Tag</slot>
  </span>
</li>
