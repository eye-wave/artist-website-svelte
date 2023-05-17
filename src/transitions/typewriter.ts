import type { TransitionConfig } from "svelte/transition"

export function typewriter(element: HTMLElement, { speed = 1 } = {}) {
  const valid = element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE

  if (!valid) throw Error("Invalid element")

  const text = element.textContent || ""
  const duration = text.length / (speed * 0.01)

  return {
    duration,
    tick: (t: number) => {
      const i = Math.trunc(text.length * t)

      element.textContent = text.slice(0, i)
    },
  } as TransitionConfig
}
