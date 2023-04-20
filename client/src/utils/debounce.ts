/* eslint-disable @typescript-eslint/no-this-alias */

export function debounce<F extends (...args: unknown[]) => unknown>(callback: F, delay: number): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return function(this: unknown, ...args: Parameters<F>): void {
    const context =this

    clearTimeout(timeoutId)
    timeoutId =setTimeout(() => callback.apply(context, args), delay)
  }
}
