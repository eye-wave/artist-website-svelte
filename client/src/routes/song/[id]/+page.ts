import type { SongMetadata } from "src/lib/music_player/queue"
import type { PageLoad } from "./$types"

export const prerender =true

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

  fetch("http://localhost:3000/wip/song/"+id,{ method: "GET" })
    .then(res => res.json())
    .then((song:SongMetadata) => data.song =song)
    .then(() => {
      fetch("http://localhost:3000/storage/file/"+data.song.descriptionId)
        .then(res => res.text())
        .then(text => {
          data.post =text
          resolve(data)
        })
    })
}))
