import type { PageServerLoad } from "./$types"
import { AUTH } from "$env/static/private"

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
  fetch("http://localhost:3000/releases/list",{ method: "POST" })
    .then(res => res.json())
    .then(releases => resolve({ releases }))
    .catch(() => console.log("Fetch failed for some reason."))
    .finally(() => resolve({ releases: [] }))
}))
