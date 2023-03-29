<script lang="ts">
  import { CUSTOM_NODE_NAME } from "../enums"
  import { musicPlayer } from "src/lib/music_player/MusicPlayerBase.svelte"
  import EffectTemplate from "./EffectTemplate.svelte"
  import Knob from "./Knob.svelte"
  
  export let color ="#7469ff"

  $: _color =active ? color : "#333"
  $: active =($presetStore?.sequence || []).indexOf(CUSTOM_NODE_NAME.REVERB) !== -1
  $: dry =$presetStore?.reverb.dry || 0.3
  $: presetStore =musicPlayer.audioEffects?.presetStore
  $: wet =$presetStore?.reverb.wet || 0.7

  function handleToggleButton(e:CustomEvent) {
    if ( !musicPlayer.audioEffects ) return

    const { sequence =[] } =musicPlayer.audioEffects.currentPreset
    const active =e.detail as boolean

    const isReverbInSequence =sequence.indexOf(CUSTOM_NODE_NAME.REVERB) !== -1
    
    if ( active && !isReverbInSequence ) sequence?.push(CUSTOM_NODE_NAME.REVERB)
    if ( !active && isReverbInSequence ) sequence?.splice(sequence.indexOf(CUSTOM_NODE_NAME.REVERB),1)

    musicPlayer.audioEffects.loadEffectChain({ sequence, reverb: { dry, wet } })
  }

</script>

<EffectTemplate color={_color} bind:active on:change={handleToggleButton}
  effectName="Reverb">
  
  <Knob
    defaultValue={0.3}
    min={0} max={1} step={0.02}
    label="dry" color={_color}
    value={dry}
    on:change={e => active && musicPlayer.audioEffects?.changeEffectParam({reverb:{dry:e.detail}})} />

  <Knob min={0} max={1} step={0.02}
    defaultValue={0.7}
    label="wet" color={_color}
    value={wet}
    on:change={e => active && musicPlayer.audioEffects?.changeEffectParam({reverb:{wet:e.detail}})} />

</EffectTemplate>