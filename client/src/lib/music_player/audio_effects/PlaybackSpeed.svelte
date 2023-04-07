<script lang="ts">
  import { musicPlayer } from "$lib/music_player"
  import Slider from "src/lib/Slider.svelte"
  import { onDestroy, onMount } from "svelte"
  import type { Unsubscriber } from "svelte/store"
  import EffectTemplate from "./EffectTemplate.svelte"
    
  let speed =1
  let unsubscribe:undefined|Unsubscriber

  $: presetStore =musicPlayer.audioEffects?.presetStore
  $: formattedSpeed =Math.floor(speed * 100) /100

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


<EffectTemplate enableToggle={false} effectName="Speed">
  <div class="w-44">
    <Slider
      on:dblclick={onReset}
      on:change={onSpeedChange} max={2} min={0.5} bind:value={speed} />
    
    <div class="text-center text-xl p-3 bg-neutral-800 rounded-full">{formattedSpeed}</div>
  </div>
</EffectTemplate>

