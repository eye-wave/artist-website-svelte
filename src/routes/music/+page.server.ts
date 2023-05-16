import type { PageServerLoad } from "./$types"

type PageData = {
  releases: ReleaseEntry[]
}

export const load: PageServerLoad = ({ fetch }) =>
  new Promise<PageData>(resolve => {
    fetch(`api/songs/official`, { method: "GET" })
      .then(res => res.json())
      .then(releases => resolve({ releases }))
      .catch(() => console.log("Fetch failed for some reason."))
      .finally(() => resolve({ releases: [] }))
  })
