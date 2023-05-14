let observer: IntersectionObserver

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
