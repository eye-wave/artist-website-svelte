import { PUBLIC_DB_URL } from "$env/static/public"
import type { SongMetadata } from "src/lib/music_player/queue"
import type { PageLoad } from "./$types"

type PageData ={
  song: SongMetadata,
  post: string
}

export const load:PageLoad =(({ fetch, params }) => new Promise<PageData>(resolve => {
  const { id } =params
  if ( id.length !== 22 ) throw new Error("404")

  const data ={
    song: {} as SongMetadata,
    post: ""
  }

  fetch(`${PUBLIC_DB_URL}/wip/song/`+id,{ method: "GET" })
    .then(res => res.json())
    .then((song:SongMetadata) => data.song =song)
    .then(() => {
      fetch(`${PUBLIC_DB_URL}/storage/file/`+data.song.descriptionId)
        .then(res => res.text())
        .then(text => {
          data.post =text
          resolve(data)
        })
    })
}))
