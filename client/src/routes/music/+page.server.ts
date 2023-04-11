import { PUBLIC_DB_URL } from "$env/static/public"
import type { PageServerLoad } from "./$types"

export type ReleaseEntry ={
  id:number,
  artists:string[],
  title:string,
  link: {
    soundcloud:string,
    youtube:string,
    spotify:string
  },
  image:string,
  timestamp: number
}

type PageData ={
  releases: ReleaseEntry[]
}

export const load:PageServerLoad =(({ fetch }) => new Promise<PageData>(resolve => {
  fetch(`${PUBLIC_DB_URL}/releases/list`,{ method: "GET" })
    .then(res => res.json())
    .then(releases => resolve({ releases }))
    .catch(() => console.log("Fetch failed for some reason."))
    .finally(() => resolve({ releases: [] }))
}))
