<script lang="ts">
  import { musicPlayer } from "src/lib/MusicPlayer.svelte";
  import EffectTemplate from "./EffectTemplate.svelte";

  let speed =1
  function onSpeedChange() {
    musicPlayer.changeEffectParam({ speed })
  }

  function onReset() {
    speed =1
    onSpeedChange()
  }

</script>

<EffectTemplate effectName="Speed" enableToggle={false}>
  <input
    on:dblclick={onReset}
    on:change={onSpeedChange}
    name="speed-changer" type="range" max={2} min={0.5} bind:value={speed} step={0.01}>

  <label for="speed-changer">{speed}</label>
</EffectTemplate>
