import type { SongMetadata } from "$lib/music_player/queue"
import type { PageLoad } from "./$types"

export type ModifiedSongData = {
  audioId: string
  metadata: {
    title: string
    imageId: string
    timestamp: number
    artists: string[]
    tags: string[]
    genre: string
  }
}

export type ArtistData = {
  name: string
  url: string
}

type PageData = {
  songs: ModifiedSongData[]
  artists: ArtistData[]
}

export const load: PageLoad = async ({ fetch }) => {
  const pageData: PageData = {
    songs: [],
    artists: [],
  }

  const promiseArray: Promise<void>[] = []

  promiseArray.push(
    new Promise(resolve => {
      fetch(`/api/songs/demos`, { method: "GET" })
        .then(res => res.json())
        .then((songs: SongMetadata[]) => {
          pageData.songs = songs
            .sort((a, b) => a.metadata.timestamp - b.metadata.timestamp)
            .reverse()
            .map(song => {
              const [genre] = song.metadata.tags || ["edm"]
              song.metadata.genre = genre

              delete song.metadata.descriptionId

              return song
            })
        })
        .catch(() => console.log("Fetch failed for some reason."))
        .finally(resolve)
    }),
  )

  promiseArray.push(
    new Promise(resolve => {
      fetch(`/api/artists`, { method: "GET" })
        .then(res => res.json())
        .then(a => (pageData.artists = a))
        .catch(() => console.log("Fetch failed for some reason."))
        .finally(resolve)
    }),
  )

  await Promise.all(promiseArray)

  return pageData
}
