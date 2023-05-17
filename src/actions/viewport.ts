let observer: IntersectionObserver

// TODO it's still not working but i think it's a good first step

declare global {
  interface HTMLElement {
    enterViewport: CustomEvent<void>
    enterFromAbove: CustomEvent<void>
    enterFromBelow: CustomEvent<void>
    leaveViewport: CustomEvent<void>
    leaveFromAbove: CustomEvent<void>
    leaveFromBelow: CustomEvent<void>
  }

  interface HTMLElementEventMap {
    enterViewport: CustomEvent<void>
    enterFromAbove: CustomEvent<void>
    enterFromBelow: CustomEvent<void>
    leaveViewport: CustomEvent<void>
    leaveFromAbove: CustomEvent<void>
    leaveFromBelow: CustomEvent<void>
  }
}

function initializeObserver() {
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.dispatchEvent(new CustomEvent("enterViewport"))

          if (entry.intersectionRect.top > entry.boundingClientRect.top) {
            entry.target.dispatchEvent(new CustomEvent("enterFromAbove"))
            return
          }
          if (entry.intersectionRect.bottom < entry.boundingClientRect.bottom) {
            entry.target.dispatchEvent(new CustomEvent("enterFromBelow"))
            return
          }
        } else {
          entry.target.dispatchEvent(new CustomEvent("leaveViewport"))

          if (entry.intersectionRect.top > entry.boundingClientRect.top) {
            entry.target.dispatchEvent(new CustomEvent("leaveFromAbove"))
            return
          }
          if (entry.intersectionRect.bottom < entry.boundingClientRect.bottom) {
            entry.target.dispatchEvent(new CustomEvent("leaveFromBelow"))
            return
          }
        }
      })
    },
    { threshold: 0.4 },
  )
}

export function viewport(element: HTMLElement) {
  if (!observer) initializeObserver()
  observer.observe(element)

  return {
    destroy() {
      observer.unobserve(element)
    },
  }
}
