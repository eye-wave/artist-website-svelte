<script lang="ts">
  export let icon:string
  export let href:string|undefined =undefined

</script>

<span class={$$props.class} style={$$props.style}>
  <i class="i {icon}" />
</span>

<style lang="postcss">
  span {
    color: currentColor;
  }

  i {
    filter: drop-shadow(2px 2px 8px #000);
  }
</style>