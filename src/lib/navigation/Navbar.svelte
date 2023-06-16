<script lang="ts">
  import { page } from "$app/stores"
  import Logo from "../icons/Logo.svg?component"
  import NavbarItem from "./NavbarItem.svelte"

  export let links = [
    { name: "Music", href: "/music" },
    { name: "w.i.p.", href: "/music/demos" },
  ]
</script>

<nav class="bg-surface0/10 flex select-none gap-10 px-3 py-10">
  <div class="flex w-full items-center justify-evenly">
    <div class="flex sm:gap-20 gap-3 text-xl">
      <NavbarItem class="w-16" href="/" label="Home page">
        <Logo />
      </NavbarItem>
      {#each links as { href, name }}
        <NavbarItem label="{name} page" active={$page.url.pathname === href} {href}>
          {name}
        </NavbarItem>
      {/each}
    </div>
  </div>
</nav>
