<script lang="ts">
  import { musicPlayer } from ".."
  import { PRESET_NAMES, type T_PRESET_NAMES } from "../enums"
  import Angery from "$lib/icons/Angery.svg?component"
  import EffectTemplate from "./EffectTemplate.svelte"
  import Fuwa from "$lib/icons/Fuwa.svg?component"
  import Happy from "$lib/icons/Happy.svg?component"
  import Sad from "$lib/icons/Sad.svg?component"

  export let currentMood: T_PRESET_NAMES = PRESET_NAMES.NORMAL
  // TODO add moodStore so this component can adapt to the actual settings

  const componentMap = new Map<T_PRESET_NAMES, typeof Happy>([
    [PRESET_NAMES.NORMAL, Happy],
    [PRESET_NAMES.SAD, Sad],
    [PRESET_NAMES.ANGRY, Angery],
    [PRESET_NAMES.HAPPY, Fuwa],
  ])

  // let currentComponent: typeof Happy = Happy

  function change(name: T_PRESET_NAMES) {
    currentMood = name
    // currentComponent = componentMap.get(name) || Happy

    musicPlayer.audioEffects?.loadPreset(currentMood)
  }
</script>

<EffectTemplate enableToggle={false} effectName="Presets">
  {#each Array.from(componentMap.entries()) as [name, Component]}
    <button class:scale-75={name !== currentMood} class="mx-auto h-12 w-12 transition-transform" on:click={() => change(name)}>
      <Component />
    </button>
  {/each}
</EffectTemplate>
