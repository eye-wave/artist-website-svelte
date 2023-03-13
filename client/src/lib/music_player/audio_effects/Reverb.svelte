<script lang="ts">
  import { musicPlayer } from "src/lib/MusicPlayer.svelte"
  // import type { ReverbNode, ReverbOptions } from "../reverb"
  import Knob from "./Knob.svelte"
  export let active =false
  export let color ="#7469ff"

</script>

<div class="p-4 bg-neutral-700">
  <span class="text-white font-bold">Reverb</span>

  <div class="flex gap-2 ">
    <Knob
      defaultValue={0.3}
      min={0} max={1} step={0.02}
      label="dry" {color}
      on:change={e => musicPlayer.changeEffectParam({reverb:{dry:e.detail}})} />
    
    <Knob min={0} max={1} step={0.02}
      defaultValue={0.7}
      label="wet" {color}
      on:change={e => musicPlayer.changeEffectParam({reverb:{wet:e.detail}})} />
    
    <div
      on:click={() => active =!active}
      class:bg-neutral-500={!active}
      style:background={active ? color : ""}
      class="cursor-pointer w-6 h-6 rounded-full" />
  </div>
</div>
