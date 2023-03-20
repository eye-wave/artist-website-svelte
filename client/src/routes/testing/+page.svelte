<script lang="ts">
  import Reverb from "$lib/music_player/audio_effects/Reverb.svelte"
  import Waveshaper from "$lib/music_player/audio_effects/Waveshaper.svelte"
  import Eq from "$lib/music_player/audio_effects/EQ.svelte"
  import PlaybackSpeed from "src/lib/music_player/audio_effects/PlaybackSpeed.svelte"

</script>

<main>
  <ul class="flex flex-col gap-1 select-none">
    <PlaybackSpeed />
    <Reverb color="#50aaff" />
    <Waveshaper color="#de8098" />
    <Eq color="#ceceaa" />
  </ul>
</main>

