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