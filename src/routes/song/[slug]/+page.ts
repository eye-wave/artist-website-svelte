import type { SongMetadata } from "$lib/music_player/queue"
import type { ArtistData } from "src/routes/music/demos/+page"
import type { PageLoad } from "./$types"

type PageData = {
  song: SongMetadata
  post: string
  artists: ArtistData[]
  waveform: string
}

export const load: PageLoad = async ({ fetch, params }) => {
  const { slug } = params

  const pageData: PageData = {
    song: {} as SongMetadata,
    post: "",
    artists: [] as ArtistData[],
    waveform: "",
  }

  const promiseArray: Promise<void>[] = []

  await new Promise<void>(resolve => {
    fetch(`/api/songs/demos/${slug}`, { method: "GET" })
      .then(res => res.json())
      .then(song => (pageData.song = song))
      .catch(() => console.log("Fetch failed for some reason."))
      .finally(resolve)
  })

  promiseArray.push(
    new Promise(resolve => {
      fetch(`/api/storage/file/${pageData.song.metadata.descriptionId}`, {
        method: "GET",
      })
        .then(res => res.text())
        .then(post => (pageData.post = post))
        .catch(() => console.log("Fetch failed for some reason."))
        .finally(resolve)
    }),
  )

  await Promise.all(promiseArray)

  promiseArray.splice(0)
  pageData.song.metadata.artists.forEach(name => {
    promiseArray.push(
      new Promise<void>(resolve => {
        fetch("/api/artists/" + name)
          .then(res => res.json())
          .then(json => pageData.artists.push(json as ArtistData))
          .then(() => resolve())
      }),
    )
  })

  await Promise.all(promiseArray)

  pageData.song.metadata.tags.sort()

  return pageData
}
