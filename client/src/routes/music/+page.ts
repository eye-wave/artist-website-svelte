import type { PageLoad } from './$types';

export const csr =false

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

export const load:PageLoad =(({ fetch }) => new Promise<PageData>(resolve => {
  fetch("http://localhost:3000/releases/list?raw=false")
    .then(res => res.json())
    .then(releases => resolve({ releases }))
    .catch(() => console.log("Fetch failed for some reason."))
    .finally(() => resolve({ releases: [] }))
}))