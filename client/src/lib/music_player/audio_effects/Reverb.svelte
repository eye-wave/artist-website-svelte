<script lang="ts">
  import { musicPlayer } from "src/lib/MusicPlayer.svelte"
  import EffectTemplate from "./EffectTemplate.svelte"
  import Knob from "./Knob.svelte"
  export let color ="#7469ff"

  let active =(musicPlayer.currentPreset.sequence || []).indexOf("reverb") !== -1
  let dry: number =musicPlayer.currentPreset.reverb?.dry || 0.3
  let wet: number =musicPlayer.currentPreset.reverb?.wet || 0.7

  function handleToggleButton(e:CustomEvent) {
    const { sequence =[] } =musicPlayer.currentPreset
    const active =e.detail as boolean

    const isReverbInSequence =sequence.indexOf("reverb") !== -1
    
    if ( active && !isReverbInSequence ) sequence?.push("reverb")
    if ( !active && isReverbInSequence ) sequence?.splice(sequence.indexOf("reverb"),1)

    musicPlayer.loadEffectChain({
      ...musicPlayer.currentPreset ,sequence,
      reverb: { dry, wet }
    })
  }

</script>

<EffectTemplate {color} bind:active on:change={handleToggleButton}
  effectName="Reverb">
  
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

</EffectTemplate>