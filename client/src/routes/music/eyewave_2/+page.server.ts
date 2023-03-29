import { PUBLIC_DB_URL } from "$env/static/public"
import type { SongMetadata } from "src/lib/music_player/queue"
import type { PageServerLoad } from "./$types"

type PageData ={ songs: Omit<SongMetadata,"descriptionId">[] }

export const load:PageServerLoad =(({ fetch }) => new Promise<PageData>(resolve => {
  fetch(`${PUBLIC_DB_URL}/wip/list?raw=true`,{ method: "POST" })
    .then(res => res.json())
    .then((songs:SongMetadata[]) => resolve({
      songs: songs
        .sort((a,b) => a.metadata.timestamp -b.metadata.timestamp)
        .map(song => {
          //@ts-ignore
          delete song.descriptionId
          return song
        })
        .reverse()
    }))
    .catch(() => console.log("Fetch failed for some reason."))
    .finally(() => resolve({ songs: [] }))
}))
