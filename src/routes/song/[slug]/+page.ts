import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"

export const load: PageLoad = async ({ fetch, params }) => {
  const { slug } = params
  const song = await new Promise<SongMetadata | undefined>(resolve => {
    fetch(`/api/songs/demos/${slug}`, { method: "GET" })
      .then(res => res.json())
      .then(resolve)
      .catch(err => {
        console.log(err)
        resolve(undefined)
      })
  })

  if (!song) throw error(404)

  return {
    song,
    waveform: "",
    post: new Promise<string>(resolve => {
      fetch("/api/storage/file/" + song.metadata.descriptionId)
        .then(res => res.text())
        .then(resolve)
        .catch(() => console.log("Fetch failed for some reason."))
        .finally(() => resolve(""))
    }),
    artists: new Promise<ArtistData[]>(resolve => {
      fetch("/api/artists")
        .then(res => res.json())
        .then((arr: ArtistData[]) => arr.filter(a => song.metadata.artists.includes(a.name)))
        .then(resolve)
        .catch(() => console.log("Fetch failed for some reason."))
        .finally(() => resolve([]))
    }),
  }
}
