import { PUBLIC_DB_URL } from "$env/static/public"
import type { PageServerLoad } from "./$types"
import type { SongMetadata } from "$lib/music_player/queue"

type PageData ={
  songs: {
    audioId: string,
    metadata:{
      title: string,
      imageId:string,
      timestamp: number,
      artists: string[],
      genre: string,
    }
  }[]
}

export const load:PageServerLoad =(({ fetch }) => new Promise<PageData>(resolve => {
  fetch(`${PUBLIC_DB_URL}/wip/list?raw=true`,{ method: "POST" })
    .then(res => res.json())
    .then((songs:SongMetadata[]) => resolve({
      //@ts-ignore
      songs: songs
        .sort((a,b) => a.metadata.timestamp -b.metadata.timestamp)
        .map(song => {
          //@ts-ignore
          delete song.descriptionId

          const [ genre ] =song.metadata.tags || ["music"]
          //@ts-ignore
          delete song.metadata.tags

          //@ts-ignore
          song.metadata.genre =genre

          return song
        })
        .reverse()
    }))
    .catch(() => console.log("Fetch failed for some reason."))
    .finally(() => resolve({ songs: [] }))
}))
