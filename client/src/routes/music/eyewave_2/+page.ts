import type { PageLoad } from "./$types"

export type DemoSong ={
  audioId:string,
  metadata:{
    title: string,
    description: string
    imageId:string,
    timestamp: number,
    artists: string[],
    tags: string[],
  }
}

type PageData ={ songs: DemoSong[] }

export const load:PageLoad =(({ fetch }) => new Promise<PageData>(resolve => {
  fetch("http://localhost:3000/wip/list",{ method: "POST" })
    .then(res => res.json())
    .then(songs => resolve({ songs }))
    .catch(() => console.log("Fetch failed for some reason."))
    .finally(() => resolve({ songs: [] }))
}))
