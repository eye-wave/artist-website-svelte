<script lang="ts">
  import { musicPlayer } from "src/lib/MusicPlayer.svelte";

  let speed =1
  function onSpeedChange() {
    musicPlayer.changeEffectParam({ speed })
  }

  function onReset() {
    speed =1
    onSpeedChange()
  }

</script>


<div class="flex gap-2 p-4 bg-neutral-700">
  <span class="text-white font-bold">Speed</span>

  <input
    on:dblclick={onReset}
    on:change={onSpeedChange}
    name="speed-changer" type="range" max={2} min={0.5} bind:value={speed} step={0.01}>
  
  <label for="speed-changer">{speed}</label>
</div>

<style lang="postcss">
  
  
</style>