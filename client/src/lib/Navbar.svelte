<script lang="ts">
  import { page } from "$app/stores"
  import Logo from "./Logo.svelte"
  import NavbarItem from "./NavbarItem.svelte"

  export let links =[
    {name: "Home",href: "/"},
    // {name: "News",href: "/news"},
    // {name: "About",href: "/about"},
    {name: "Music",href: "/music"},
    // {name: "Contact",href: "/contact"},
    {name: "Debug",href: "/testing"},
  ]

  // TODO create theme swticher with cool animation based on:
  // https://youtu.be/6D5jSRfoSAA?t=5929

  // TODO responsive web design
</script>

<nav class="bg-surface0/10 px-3 py-10 select-none flex gap-10">
  <div class="flex items-center justify-evenly w-full">
    <div class="text-primary-400 text-3xl w-40">
      <Logo />
    </div>
    <div class="flex gap-3 text-xl">
      {#each links as {href,name}}
        <NavbarItem active={$page.url.pathname === href} {href} {name}/>
      {/each}
    </div>
  </div>
</nav>

<style>
  nav {
    background-color: #ffffff05;
  }
</style>