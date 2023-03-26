import type { SongMetadata } from "src/lib/music_player/queue"
import type { PageServerLoad } from "./$types"

export const prerender =true

type PageData ={ songs: SongMetadata[] }

export const load:PageServerLoad =(({ fetch }) => new Promise<PageData>(resolve => {
  fetch("http://localhost:3000/wip/list?raw=true",{ method: "POST" })
    .then(res => res.json())
    .then((songs:SongMetadata[]) => resolve({ songs: songs.sort((a,b) => a.metadata.timestamp -b.metadata.timestamp).reverse() }))
    .catch(() => console.log("Fetch failed for some reason."))
    .finally(() => resolve({ songs: [] }))
}))
