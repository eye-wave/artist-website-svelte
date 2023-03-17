<script lang="ts">
  import MusicPlayer, { musicPlayer } from "src/lib/MusicPlayer.svelte"
  import Reverb from "$lib/music_player/audio_effects/Reverb.svelte"
  import Waveshaper from "$lib/music_player/audio_effects/Waveshaper.svelte"
  import Eq from "$lib/music_player/audio_effects/EQ.svelte"
  import EffectNode from "src/lib/music_player/audio_effects/EffectNode.svelte"
  import Knob from "src/lib/music_player/audio_effects/Knob.svelte"
  import DbMeter from "src/lib/music_player/audio_effects/DbMeter.svelte"
    import AudioGraph from "src/lib/music_player/audio_effects/AudioGraph.svelte";
    import PlaybackSpeed from "src/lib/music_player/audio_effects/PlaybackSpeed.svelte";
  
</script>

<main>
  <ul class="flex flex-col gap-1 select-none">
    <PlaybackSpeed />
    <Reverb color="#50aaff" />
    <Waveshaper color="#de8098" />
    <Eq color="#ceceaa" />


    <!-- <EffectNode>
      <span slot="label">Reverb</span>
      <Knob label="dry"
        on:change={e => musicPlayer.changeEffectParam({reverb:{dry:e.detail}})} />
      <Knob min={0} label="wet"
        on:change={e => musicPlayer.changeEffectParam({reverb:{wet:e.detail}})} />
    </EffectNode> -->
  </ul>
</main>

