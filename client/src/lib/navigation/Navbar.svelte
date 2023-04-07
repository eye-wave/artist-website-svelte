<script lang="ts">
  import { page } from "$app/stores"
  import Logo from "../icons/Logo.svg?component"
  import NavbarItem from "./NavbarItem.svelte"

  export let links =[
    {name: "Music",href: "/music"},
    {name: "w.i.p.",href: "/music/eyewave_2"},
  ]

  // TODO create theme swticher with cool animation based on:
  // https://youtu.be/6D5jSRfoSAA?t=5929
</script>

<nav class="bg-surface0/10 px-3 py-10 select-none flex gap-10">
  <div class="flex items-center justify-evenly w-full">
    <div class="flex gap-3 text-xl">
      <NavbarItem class="w-16" href="/">
        <Logo />
      </NavbarItem>
      {#each links as {href,name}}
        <NavbarItem active={$page.url.pathname === href} {href}>
          {name}
        </NavbarItem>
      {/each}
    </div>
  </div>
</nav>
