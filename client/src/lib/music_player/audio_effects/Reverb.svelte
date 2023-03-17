<script lang="ts">
  import { musicPlayer } from "src/lib/MusicPlayer.svelte"
  // import type { ReverbNode, ReverbOptions } from "../reverb"
  import Knob from "./Knob.svelte"
  export let active =musicPlayer.currentPreset.sequence?.includes("reverb") || false
  export let color ="#7469ff"

  let dry: number =musicPlayer.currentPreset.reverb?.dry || 0.3
  let wet: number =musicPlayer.currentPreset.reverb?.wet || 0.7

  function handleToggleButton() {
    active =!active
    const { sequence =[] } =musicPlayer.currentPreset
    
    if ( active ) sequence?.push("reverb")
    else sequence?.splice(sequence.indexOf("reverb"),1)

    musicPlayer.loadEffectChain({
      ...musicPlayer.currentPreset ,sequence,
      reverb: { dry, wet }
    })
  }

</script>

<div class="p-4 bg-neutral-700">
  <span class="text-white font-bold">Reverb</span>

  <div class="flex gap-2 ">
    <Knob
      defaultValue={0.3}
      min={0} max={1} step={0.02}
      label="dry" {color}
      bind:value={dry}
      on:change={e => active && musicPlayer.changeEffectParam({reverb:{dry:e.detail}})} />
    
    <Knob min={0} max={1} step={0.02}
      defaultValue={0.7}
      label="wet" {color}
      bind:value={wet}
      on:change={e => active && musicPlayer.changeEffectParam({reverb:{wet:e.detail}})} />
    
    <div
      on:click={handleToggleButton}
      class:bg-neutral-500={!active}
      style:background={active ? color : ""}
      class="cursor-pointer w-6 h-6 rounded-full" />
  </div>
</div>
