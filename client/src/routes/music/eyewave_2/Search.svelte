<script lang="ts">
  import SearchIcon from "virtual:icons/solar/minimalistic-magnifer-linear"
  import CloseIcon from "virtual:icons/ic/round-cancel"
  
  export let value =""
  export let tags =new Set<string>()

  let inputElement:HTMLInputElement
  
  function onEnterKey() {
    tags =new Set([...tags,...value.split(" ")])
    value =""
  }

  function onTagRemove(tagName:string) {
    tags.delete(tagName)
    tags =tags
  }

  function handleFocusOnKeyDown(e:KeyboardEvent) {
    const eKey =e.key.toLowerCase()

    if ( e.key === "/" || e.ctrlKey && eKey === "k" ) {
      e.preventDefault()
      inputElement.focus()
    }
  }

  function handleBlur(e:KeyboardEvent) {
    if ( e.key === "Escape" ) {
      (e.target as HTMLElement)?.blur()
    }
  }

</script>

<svelte:window on:keydown={handleFocusOnKeyDown} />

<div class="my-10 px-2 w-full max-w-xl">
  <div class="rounded-md mb-2 gap-2 bg-neutral-800 flex items-center px-2">
    <SearchIcon />
    <input class="bg-transparent w-full p-2"
      bind:this={inputElement} bind:value
      on:keydown={e => e.key === "Enter" && onEnterKey()}
      on:keydown={handleBlur}
      type="text" placeholder="Search for songs">
  </div>
  <ul class="flex flex-wrap gap-2 justify-center select-none">
    {#each [...tags] as tag,i (i)}
      <li class="text-xs p-2 bg-neutral-800 rounded-full items-center flex gap-1 text-neutral-300">
        <span>{tag}</span>
        <button on:click={() => onTagRemove(tag)}>
          <CloseIcon />
        </button>
      </li>
    {/each}
  
    {#if tags.size > 1}
      <li class="text-xs p-2 rounded-full bg-gradient-to-b from-rose-600 to-orange-600 items-center flex gap-1 text-white">
        <span>Remove All</span>
        <button on:click={() => tags =new Set()}>
          <CloseIcon />
        </button>
      </li>
    {/if}
  </ul>
</div>

<style lang="postcss">
  input:focus { outline: none }
  div>div:focus-within {
    box-shadow: 0 0 10px 2px #ffffff40;
  }

</style>