import { DB_SECRET_KEY } from "$env/static/private"
import { fail } from "@sveltejs/kit"
import type { File } from "buffer"
import sharp from "sharp"
import type { SongMetadata } from "src/lib/music_player/queue"
import { mongoWrapper } from "../../../db.server"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ fetch }) => {
  const artists = (await await fetch("/api/artists").then(res => res.json())) as { name: string; url: string }[]

  return { artists }
}

export const actions = {
  upload: async ({ request }) => {
    const data = await request.formData()
    const secret = data.get("secretKey") as string

    if (!secret) return fail(401, { errorMessage: "Authentication failed. Please provide valid credentials." })
    if (secret !== DB_SECRET_KEY) return fail(403, { errorMessage: "Authentication failed. Please provide valid credentials." })

    let formImage = data.get("image") as unknown as File | undefined
    let formAudio = data.get("audio") as unknown as File | undefined
    const formDescription = data.get("description") as string | undefined
    const formTags = (data.get("tags") as string).split(",")
    const formArtists = (data.get("artists") as string).split(",")
    const formTitle = data.get("title") as string
    const rawFormDate = data.get("date") as string
    const formTimestamp = isNaN(parseInt(rawFormDate)) ? parseInt(rawFormDate) : Math.floor(Date.now() / 1000)

    if ((formImage?.size || 0) < 1) formImage = undefined
    if ((formAudio?.size || 0) < 1) formAudio = undefined

    if (!formAudio?.type?.startsWith("audio"))
      return fail(415, { errorMessage: "Invalid song file format. Only audio files are allowed." })
    if (!formAudio) return fail(400, { errorMessage: "No song file provided." })
    if (!formDescription) return fail(400, { errorMessage: "Missing song description." })
    if (!formTimestamp) return fail(400, { errorMessage: "Missing timestamp. Please provide a valid timestamp." })
    if (formArtists.length < 1) return fail(400, { errorMessage: "Please specify at least one artist." })
    if (formImage && !formImage.type.startsWith("image"))
      return fail(415, { errorMessage: "Invalid image file format. Only image files are allowed." })
    if (formTags.length < 1) return fail(400, { errorMessage: "Please specify at least one tag as a song genre." })

    let imageId = ""

    if (formImage) {
      const imageArrayBuffer = await formImage.arrayBuffer()
      const imageBuffer = Buffer.from(imageArrayBuffer)

      const metadata = await sharp(imageBuffer).metadata()
      const width = metadata.width ?? 400
      const height = metadata.height ?? 400
      const size = width < height ? width : height

      const imageStream = sharp(imageBuffer).flatten().resize(size, size).resize(500, 500).webp()
      imageId = (await mongoWrapper.uploadFileAsStream(imageStream, secret)).toHexString()
    }

    const audioArrayBuffer = await formAudio.arrayBuffer()
    const audioBuffer = Buffer.from(audioArrayBuffer)
    const audioId = (await mongoWrapper.uploadFile(audioBuffer, secret)).toHexString()

    const descriptionId = (await mongoWrapper.uploadFile(Buffer.from(formDescription), secret)).toHexString()

    const demoSong: SongMetadata = {
      audioId,
      metadata: {
        imageId,
        title: formTitle,
        artists: formArtists,
        timestamp: formTimestamp,
        tags: formTags,
        descriptionId,
      },
    }

    const result = await mongoWrapper.uploadDemoSong(demoSong, secret)
    console.log(result)

    return { success: true }
  },
} satisfies Actions
