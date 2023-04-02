<script lang="ts">
  import { musicPlayer } from "$lib/music_player"
  import { onDestroy, onMount } from "svelte"
  import EffectTemplate from "./EffectTemplate.svelte"
  import type { Unsubscriber } from "svelte/store"

  $: presetStore =musicPlayer.audioEffects?.presetStore
  
  let speed =1
  let unsubscribe:undefined|Unsubscriber

  onMount(() => {
    if ( !presetStore ) return
    unsubscribe =presetStore.subscribe(val => speed =val.speed)
  })

  onDestroy(() => typeof unsubscribe === "function" && unsubscribe() )

  /* NOTE holy shit i found a bug in svelte framework
  * i'm using onmount, ondestroy and unsubscribe because autosubscribtions with $ are broken for some reason
  * my range input is stuck, and can't be moved
  * and $: console.log($presetStore) fired on every update frame when *moving* input even tho store hasn't changed at all
  */

  function onSpeedChange() {
    musicPlayer.audioEffects?.changeEffectParam({ speed })
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
