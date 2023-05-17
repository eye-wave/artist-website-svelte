import type { PageLoad } from "../$types"

export const prerender = true
export const load: PageLoad = ({ fetch }) => {
  return {
    releases: new Promise<ReleaseEntry[]>(resolve => {
      fetch(`api/songs/official`, { method: "GET" })
        .then(res => res.json())
        .then(resolve)
        .catch(() => console.log("Fetch failed for some reason."))
        .finally(() => resolve([]))
    }),
  }
}
