<script lang="ts">
    import { PUBLIC_DB_URL } from "$env/static/public";
  export let data  
  const { song, post } =data

</script>

<img src="{PUBLIC_DB_URL}/storage/file/{song.metadata.imageId}?width=80" width={80} alt="">
<h1>{song.metadata.title}</h1>

<p>{post}</p>

<style lang="postcss">
  
  
</style>