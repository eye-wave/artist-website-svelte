import { PUBLIC_DB_URL } from "$env/static/public"
import type { ArtistData } from "src/routes/music/eyewave_2/+page"
import type { PageLoad } from "./$types"
import type { SongMetadata } from "$lib/music_player/queue"

type PageData ={
  song: SongMetadata,
  post: string,
  artists: ArtistData[],
  waveform: string
}

export const load:PageLoad =(async ({ fetch, params }) => {
  const { slug } =params
  if ( slug.length !== 22 ) throw new Error("404")

  const pageData:PageData ={
    song: {} as SongMetadata,
    post: "",
    artists: [] as ArtistData[],
    waveform: ""
  }

  const promiseArray:Promise<void>[] =[]

  await new Promise<void>(resolve => {
    fetch(`${PUBLIC_DB_URL}/wip/song/${slug}`,{ method: "GET" })
      .then(res => res.json())
      .then(song => pageData.song =song)
      .catch(() => console.log("Fetch failed for some reason."))  
      .finally(resolve)
  })

  promiseArray.push(new Promise(resolve => {
    fetch(`${PUBLIC_DB_URL}/storage/file/${pageData.song.metadata.descriptionId}`,{ method: "GET" })
      .then(res => res.text())
      .then(post => pageData.post =post)
      .catch(() => console.log("Fetch failed for some reason."))  
      .finally(resolve)
  }))

  promiseArray.push(new Promise(resolve => {
    fetch(`${PUBLIC_DB_URL}/storage/file/${pageData.song.audioId}?waveform=true&res=100&svg=true`,{ method: "GET" })
      .then(res => res.text())
      .then(data => pageData.waveform =data)
      .catch(() => console.log("Fetch failed for some reason."))  
      .finally(resolve)
  }))

  await Promise.all(promiseArray)
  pageData.song.metadata.tags.sort()

  return pageData
})
