// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types
declare namespace App {
  // interface Error {}
  // interface Locals {}
  // interface PageData {}
  // interface Platform {}
}

declare module "*.opus"
declare module "virtual:icons*"

declare module "*.svg?component" {
  import type { ComponentType, SvelteComponentTyped } from "svelte"
  import type { SVGAttributes } from "svelte/elements"

  const content: ComponentType<SvelteComponentTyped<SVGAttributes<SVGSVGElement>>>

  export default content
}

// Released song object /music
declare type ReleaseEntry = {
  id: number
  artists: string[]
  title: string
  link: {
    soundcloud: string
    youtube: string
    spotify: string
  }
  image: string
  timestamp: number
}

// Demo song object /music/demos
declare type SongMetadata = {
  audioId: string
  metadata: {
    imageId: string
    title: string
    artists: string[]
    timestamp: number
    tags: string[]
    descriptionId: string
  }
}
