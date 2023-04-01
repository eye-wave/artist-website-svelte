export function typewriter(element:HTMLElement,{ speed =1 }) {
  const valid = (
    element.childNodes.length === 1 &&
    element.childNodes[0].nodeType === Node.TEXT_NODE
  )

  if (!valid) {
    throw new Error("This transition only works on elements with a single text node child")
  }


  const text = element.textContent || ""
  const duration = text.length / (speed * 0.01)

  return {
    duration,
    tick: (t:number) => {
      const i =Math.trunc(text.length * t)

      element.textContent =text.slice(0, i)
    }
  }

}
