<script lang="ts">
  export let dot =true
</script>

<li class="flex gap-1 items-center bg-black/50 w-fit px-2 rounded-full{$$props.class ? " "+ $$props.class : "" }">
  {#if dot}
    <div class="w-2 h-2 bg-current rounded-full"></div>
  {/if}
  <span class="text-sm">
    <slot>#Tag</slot>
  </span>
</li>
