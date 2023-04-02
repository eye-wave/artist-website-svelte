import { PUBLIC_DB_URL } from "$env/static/public"
import type { PageLoad } from "./$types"
import type { SongMetadata } from "$lib/music_player/queue"

type PageData ={
  song: SongMetadata,
  post: string
}

export const csr =false

export const load:PageLoad =(({ fetch, params }) => new Promise<PageData>(resolve => {
  const { slug } =params
  if ( slug.length !== 22 ) throw new Error("404")

  const data ={
    song: {} as SongMetadata,
    post: ""
  }

  fetch(`${PUBLIC_DB_URL}/wip/song/`+slug,{ method: "GET" })
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
