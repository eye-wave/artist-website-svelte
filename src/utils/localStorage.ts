export function useLocalStorage() {
  return {
    get(key: string) {
      const item = localStorage.getItem(key)
      if (item === null) return null
      try {
        return JSON.parse(item)
      } catch (_) {
        if (item === "true") return true
        if (item === "false") return false

        const n = +item
        if (isNaN(n)) return item
        return n
      }
    },

    set(key: string, item: unknown) {
      switch (typeof item) {
        case "function":
        case "undefined":
        case "symbol":
          return this

        case "object":
          localStorage.setItem(key, JSON.stringify(item))
          break
        default:
          localStorage.setItem(key, item as string)
      }

      return this
    },

    delete(key: string) {
      localStorage.removeItem(key)
      return this
    },

    nuke() {
      Object.keys(localStorage).forEach(key => localStorage.removeItem(key))
    },
  }
}

export const lStorage = useLocalStorage()
