<script lang="ts">
  import { page } from "$app/stores"
  import Logo from "../icons/Logo.svg?component"
  import NavbarItem from "./NavbarItem.svelte"

  export let links = [
    { name: "Music", href: "/music" },
    { name: "w.i.p.", href: "/music/demos" },
  ]
</script>

<nav class="flex select-none gap-10 bg-black/30 px-3 py-10 shadow-xl">
  <div class="flex w-full items-center justify-evenly">
    <div class="flex gap-3 text-xl sm:gap-20">
      <NavbarItem noUnderline={true} active={$page.url.pathname === "/"} class="w-16" href="/" label="Home page">
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
