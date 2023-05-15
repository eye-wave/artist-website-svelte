<script lang="ts">
  import { formatUnixDate } from "src/utils/date.js"
  import AutocompInput from "$lib/inputs/AutocompInput.svelte"
  import CloseIcon from "virtual:icons/ic/round-cancel"
  import Input from "$lib/inputs/Input.svelte"
  import InputNumber from "$lib/inputs/InputNumber.svelte"
  import KeyIcon from "virtual:icons/material-symbols/key-rounded"
  import Noscript from "$lib/Noscript.svelte"
  import PersonIcon from "virtual:icons/material-symbols/person"
  import TagIcon from "virtual:icons/ic/round-tag"
  import TagInput from "$lib/inputs/TagInput.svelte"
  import UploadIcon from "virtual:icons/ic/round-upload"
  import Textarea from "src/lib/inputs/Textarea.svelte"

  export let data
  export let form

  $: errorMessage = form?.errorMessage || ""

  let timestamp = 1672531200

  let audioError = ""
  let audioInput: HTMLInputElement
  let audioName = ""
  let audioPreviewSrc = ""

  let imageError = ""
  let imageInput: HTMLInputElement
  let imagePreviewSrc = ""

  let songTags: Set<string> = new Set()
  let songArtists: Set<string> = new Set()

  async function onFileUpload(e: Event, fileType: string) {
    const input = e.target as HTMLInputElement
    const [file] = input.files || []

    if (!file) throw Error("No file uploaded")
    if (!file.type.startsWith(fileType)) throw Error("Invalid file type")
    if (file.size > 10485760) throw Error("File size should not exceed 10MB")

    const reader = new FileReader()

    return new Promise<{ data: string; name: string }>((resolve, reject) => {
      reader.onerror = reject
      reader.onload = e =>
        resolve({
          data: e.target?.result as string,
          name: file.name,
        })
      reader.readAsDataURL(file)
    })
  }

  async function onImageUpload(e: Event) {
    imageError = ""
    imagePreviewSrc = ""
    onFileUpload(e, "image")
      .then(file => (imagePreviewSrc = file.data))
      .catch(err => (imageError = err))
  }

  async function onAudioUpload(e: Event) {
    audioError = ""
    audioPreviewSrc = ""
    onFileUpload(e, "audio")
      .then(file => {
        audioName = file.name
        audioPreviewSrc = file.data
      })
      .catch(err => (audioError = err))
  }

  function removeAudioFile() {
    if (!audioInput.files) return

    audioPreviewSrc = ""
    audioName = ""
    audioInput.files = new DataTransfer().files
    audioInput.value = ""
  }

  function removeImageFile() {
    imagePreviewSrc = ""
    imageInput.files = new DataTransfer().files
    imageInput.value = ""
  }
</script>

<Noscript />

<form
  action="?/upload"
  method="POST"
  class="mx-auto flex w-full max-w-6xl flex-col gap-3 bg-neutral-900 p-5"
  enctype="multipart/form-data"
>
  <div class="block gap-2 md:flex">
    <label for="image" class="relative flex aspect-square w-full max-w-sm cursor-pointer">
      <input on:change={onImageUpload} bind:this={imageInput} type="file" name="image" id="image" class="hidden" />

      <div class="relative flex aspect-square w-full items-center gap-2 overflow-hidden rounded-md bg-neutral-800">
        <div class="absolute inset-0 h-full w-full bg-cover bg-center" style="background-image:url({imagePreviewSrc})" />

        <div
          class:opacity-0={imagePreviewSrc}
          class="z-[1] flex h-full w-full items-center justify-center opacity-0 hover:bg-black/50 hover:opacity-100"
        >
          <div>
            <span class="text-xs sm:text-sm">Upload image</span>
            <UploadIcon class="inline text-3xl sm:text-4xl" />
            {#if imageError}
              <p class="block text-center text-red-400">{imageError}</p>
            {/if}
            {#if imagePreviewSrc}
              <button
                class="mx-auto flex items-center gap-1 rounded-full bg-gradient-to-b from-rose-600 to-orange-600 p-2 text-xs text-white"
                on:click={removeImageFile}
              >
                Remove <CloseIcon />
              </button>
            {/if}
          </div>
        </div>
      </div>
    </label>

    <div class="flex w-full flex-col justify-evenly">
      <div>
        <Input name="title" caption="Title" placeholder="Enter song title" />
      </div>

      <hr />

      <input type="text" name="artists" class="hidden" value={[...songArtists.keys()].join(",")} />
      <AutocompInput bind:tags={songArtists} items={data.artists.map(a => a.name)}>
        <PersonIcon slot="icon" />
      </AutocompInput>

      <hr />

      <input type="text" name="tags" class="hidden" value={[...songTags.keys()].join(",")} />
      <TagInput bind:tags={songTags} placeholder="Song tags . . ." windowFocus={false}>
        <TagIcon slot="icon" />
      </TagInput>

      <hr />

      <div class="relative flex w-full flex-col justify-center sm:flex-row">
        <div class="flex-1">
          <InputNumber bind:value={timestamp} caption="Timestamp" name="date" min={1672531200} max={4102444800} />
        </div>

        <div class="mb-4 flex items-center justify-center gap-2 sm:mt-6">
          <div class="flex h-full w-24 items-center justify-center text-xs lg:w-44 lg:text-xl">
            {formatUnixDate(timestamp)}
          </div>

          <button
            on:click|preventDefault={() => (timestamp = Math.floor(Date.now() / 1000))}
            class="h-10 w-16 rounded-full bg-gradient-to-b from-neutral-500 to-neutral-600 text-xs">Now</button
          >
        </div>
      </div>

      <hr />

      <Input class="text-xs" name="secretKey" placeholder="Secret key . . .">
        <KeyIcon />
      </Input>
    </div>
  </div>

  <hr />

  <div
    class="relative grid h-44 w-full grid-rows-3 items-center justify-items-center overflow-hidden rounded-md bg-neutral-800 sm:h-24 sm:grid-cols-2 sm:grid-rows-1"
  >
    <label for="audio" class="relative h-full w-full cursor-pointer">
      <input on:change={onAudioUpload} bind:this={audioInput} type="file" name="audio" id="audio" class="hidden" />
      <div class="flex h-full w-full items-center justify-center bg-white/5">
        <span class="text-xs sm:text-sm">Upload audio</span>
        <UploadIcon class="inline text-3xl sm:text-4xl" />
        {#if audioError}
          <p class="block text-center text-red-400">{audioError}</p>
        {/if}
      </div>
    </label>

    <div class="flex h-full w-full flex-col items-center gap-2 p-2">
      <audio
        src={audioPreviewSrc}
        class:opacity-20={!audioPreviewSrc}
        class:pointer-events-none={!audioPreviewSrc}
        class="w-full min-w-0"
        controls
      />

      {#if audioPreviewSrc}
        <div class="flex w-full flex-col items-center justify-evenly sm:flex-row">
          <p class="text-center">{audioName || "kutas.mp3"}</p>
          <button
            class="flex items-center gap-1 rounded-full bg-gradient-to-b from-rose-600 to-orange-600 p-2 text-xs text-white"
            on:click={removeAudioFile}
          >
            Remove <CloseIcon />
          </button>
        </div>
      {/if}
    </div>
  </div>

  <hr />

  <Textarea name="description" placeholder="Enter song description here" />

  <hr />

  {#if errorMessage}
    <p class="text-center text-red-400">{errorMessage}</p>
  {/if}

  <button type="submit" class="mx-auto h-10 w-32 rounded-full bg-primary-400 px-4">Upload</button>
</form>

<style lang="postcss">
  hr {
    @apply my-4 border-0 ring-1 ring-white/10;
  }
</style>
