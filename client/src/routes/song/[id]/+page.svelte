<script lang="ts">
  import type { SongMetadata } from "src/lib/music_player/queue"
  export let data  
  const { song, post } =data

</script>

<img src="http://localhost:3000/storage/file/{song.metadata.imageId}?width=80" width={80} alt="">
<h1>{song.metadata.title}</h1>

<p>{post}</p>

<style lang="postcss">
  
  
</style>