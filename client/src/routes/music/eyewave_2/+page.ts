import { PUBLIC_DB_URL } from "$env/static/public"
import type { PageLoad } from "./$types"
import type { SongMetadata } from "$lib/music_player/queue"

type ModifiedSongData ={
  audioId: string,
  metadata:{
    title: string,
    imageId:string,
    timestamp: number,
    artists: string[],
    genre: string,
  }
}

export type ArtistData ={
  name:string,
  link:string,
  image:string,
  descriptio:string
}

type PageData ={
  songs: ModifiedSongData[],
  artists: ArtistData[]
}

export const load:PageLoad =(async ({ fetch }) => {
  const pageData:PageData ={
    songs: [],
    artists: []
  }

  const promiseArray:Promise<void>[] =[]

  promiseArray.push(new Promise(resolve => {
    fetch(`${PUBLIC_DB_URL}/wip/list`,{ method: "POST" })
      .then(res => res.json())
      .then((songs:SongMetadata[]) => {
        pageData.songs =songs
          .sort((a,b) => a.metadata.timestamp -b.metadata.timestamp)
          .reverse()
          .map(song => {
            const [ genre ] =song.metadata.tags || [ "edm" ]
            song.metadata.genre =genre

            delete song.metadata.descriptionId
            delete song.metadata.tags

            return song
          })
      })
      .catch(() => console.log("Fetch failed for some reason."))  
      .finally(resolve)
  }))
  
  promiseArray.push(new Promise(resolve => {
    fetch(`${PUBLIC_DB_URL}/artists/list`,{ method: "POST" })
      .then(res => res.json())
      .then(a => pageData.artists =a)
      .catch(() => console.log("Fetch failed for some reason."))  
      .finally(resolve)
  }))
  
  await Promise.all(promiseArray)
  
  return pageData
})
