<script lang="ts">
  import { page } from "$app/stores"
  import NavbarItem from "src/lib/NavbarItem.svelte"

  export let links =[
    {name: "Official",href: "/music"},
    {name: "W.I.P.s",href: "/music/eyewave_2"},
    {name: "Shitposts",href: "/music/eW91IGZvdW5kIHRoZSBzZWNyZXQ="},
  ]  

</script>

<nav class="flex gap-3 justify-center my-5 font-bold">
  {#each links as {href,name}}
    <NavbarItem active={$page.url.pathname === href} {href} {name}/>
  {/each}
</nav>

<slot />