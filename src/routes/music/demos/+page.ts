import type { PageLoad } from "./$types"

type ModifiedSongData = {
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

export const load: PageLoad = async ({ fetch }) => {
  return {
    songs: new Promise<ModifiedSongData[]>(resolve => {
      fetch(`/api/songs/demos`, { method: "GET" })
        .then(res => res.json())
        .then((songs: SongMetadata[]) => {
          return songs
            .sort((a, b) => a.metadata.timestamp - b.metadata.timestamp)
            .reverse()
            .map(song => {
              const [genre] = song.metadata.tags || ["edm"]
              const newSong = { ...song } as unknown as ModifiedSongData

              newSong.metadata.genre = genre
              if ("descriptionId" in newSong.metadata) delete newSong.metadata.descriptionId

              return newSong
            })
        })
        .then(resolve)
        .catch(() => console.log("Fetch failed for some reason."))
        .finally(() => resolve([]))
    }),

    artists: new Promise<ArtistData[]>(resolve => {
      fetch(`/api/artists`, { method: "GET" })
        .then(res => res.json())
        .then(resolve)
        .catch(() => console.log("Fetch failed for some reason."))
        .finally(() => resolve([]))
    }),
  }
}
