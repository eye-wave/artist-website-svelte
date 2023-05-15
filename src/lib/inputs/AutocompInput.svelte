<script lang="ts">
  import { debounce } from "src/utils/debounce"
  import CloseIcon from "virtual:icons/ic/round-cancel"

  export let value = ""
  export let tags = new Set<string>()
  export let items: string[]

  let isMenuOpened = false
  let searchedItems = [] as string[]
  let lastSearched = ""
  // let selectedIndex = 0
  // TODO arrow keys for selecting items in autocomplete

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      isMenuOpened = false
      e.preventDefault()

      if (!searchedItems[0]) return
      const tag = searchedItems[0]

      tags = tags.add(tag)
      value = ""

      return
    }

    if (e.key === "Escape") {
      const input = e.target as HTMLElement
      input.blur()
      return
    }

    isMenuOpened = true
  }

  function onSearch() {
    searchedItems = items.filter(i => i.toLowerCase().startsWith(value.toLowerCase()))
    searchedItems = searchedItems
  }

  const debouncedOnSearch = debounce(onSearch, 70)

  $: {
    if (value.trim() !== lastSearched || searchedItems) {
      lastSearched = value.trim()
      debouncedOnSearch()
    }
  }

  function onTagRemove(tagName: string) {
    tags.delete(tagName)
    tags = tags
  }
</script>

<div class="relative w-full max-w-xl px-2">
  <div class="mb-2 flex items-center gap-2 rounded-md bg-neutral-800 px-2">
    <slot name="icon" />
    <input
      class="w-full bg-transparent p-2"
      bind:value
      on:blur={() => (isMenuOpened = false)}
      on:keydown={handleKeyDown}
      type="text"
      placeholder="Artist name"
    />
  </div>

  {#if isMenuOpened}
    <ul class="absolute w-full rounded-md bg-black p-1">
      {#each searchedItems.slice(0, 4) as item, i}
        <li class:bg-primary-500={i === 0} class="rounded-full px-5 py-1" style="opacity:{(1 / 5) * (4 - i)}">{item}</li>
      {/each}
    </ul>
  {/if}

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

<style lang="postcss">
  input:focus {
    outline: none;
  }
  div > div > div:focus-within {
    box-shadow: 0 0 10px 2px #ffffff40;
  }
</style>
