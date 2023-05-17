import type { TransitionConfig } from "svelte/transition"
import { rng } from "~/utils/random"

export const glitch = (element: HTMLElement, { speed = 0.7 } = {}) => {
  const valid = element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE

  if (!valid) throw Error("Invalid element")

  const text = element.textContent || ""
  const duration = (text.length + 1) / (speed * 0.01)
  const letters = Array.from({ length: text.length }).map((_, i) => i)
  let lastTick = -1

  return {
    duration,
    tick: (t: number) => {
      const i = Math.trunc(text.length * t)
      if (i !== lastTick) {
        lastTick = i
        letters.splice(rng(letters.length), 1)
      }

      element.textContent = Array.from({ length: text.length })
        .map(() => String.fromCharCode(rng(33, 126)))
        .map((ch, index) => (letters.includes(index) ? ch : text.charAt(index)))
        .join("")
    },
  } as TransitionConfig
}
