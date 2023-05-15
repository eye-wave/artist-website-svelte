<script lang="ts">
  import { browser } from "$app/environment"
  import { onDestroy, onMount } from "svelte"
  import CloseIcon from "virtual:icons/ic/round-cancel"
  import Input from "./Input.svelte"
  import SearchIcon from "virtual:icons/solar/minimalistic-magnifer-linear"

  export let placeholder = "Search for songs"
  export let tags = new Set<string>()
  export let value = ""
  export let windowFocus = true

  let inputElement: HTMLInputElement

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      value
        .split(" ")
        .filter(i => i.length > 1)
        .forEach(i => tags.add(i.trim()))
      tags = tags
      value = ""

      return
    }

    if (e.key === "Escape") {
      ;(e.target as HTMLElement)?.blur()
    }
  }

  function onTagRemove(tagName: string) {
    tags.delete(tagName)
    tags = tags
  }

  function handleFocusOnKeyDown(e: KeyboardEvent) {
    const eKey = e.key.toLowerCase()

    if (e.key === "/" || (e.ctrlKey && eKey === "k")) {
      e.preventDefault()
      inputElement.focus()
    }
  }

  onMount(() => windowFocus && window.addEventListener("keydown", handleFocusOnKeyDown))
  onDestroy(() => windowFocus && browser && window.removeEventListener("keydown", handleFocusOnKeyDown))
</script>

<div class="w-full max-w-xl px-2 {$$props.class}">
  <Input bind:inputElement bind:value on:keydown={handleKeyDown} {placeholder}>
    <slot name="icon"><SearchIcon /></slot>
  </Input>

  <ul class="flex select-none flex-wrap justify-center gap-2">
    {#each [...tags] as tag, i (i)}
      <li class="flex items-center gap-1 rounded-full bg-neutral-800 p-2 text-xs text-neutral-300">
        <span>{tag}</span>
        <button on:click={() => onTagRemove(tag)}>
          <CloseIcon />
        </button>
      </li>
    {/each}

    {#if tags.size > 1}
      <li class="flex items-center gap-1 rounded-full bg-gradient-to-b from-rose-600 to-orange-600 p-2 text-xs text-white">
        <span>Remove All</span>
        <button on:click={() => (tags = new Set())}>
          <CloseIcon />
        </button>
      </li>
    {/if}
  </ul>
</div>
