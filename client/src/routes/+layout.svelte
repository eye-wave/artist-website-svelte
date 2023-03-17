<script lang="ts">
  import Footer from "src/lib/Footer.svelte";
  import MusicPlayer from "src/lib/MusicPlayer.svelte";
  import Navbar from "src/lib/Navbar.svelte"
  import "./styles.css"
  
</script>

<Navbar />
<slot />

<MusicPlayer />
<Footer />