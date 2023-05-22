import { mongoWrapper } from "$api/db.server"
import { error } from "@sveltejs/kit"
import sharp from "sharp"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = async ({ params, url, request }) => {
  const fileId = params.slug

  if (fileId === "undefined") throw error(404)
  if (fileId === "null") throw error(404)
  if (fileId === "") throw error(404)

  const { stream, metadata } = await mongoWrapper.downloadFileAsStream(fileId)
  const responseOptions: ResponseInit = {
    headers: {
      "Cache-Control": "max-age=31536000",
    },
  }

  if (metadata && "filename" in metadata) {
    const regex = /.+\./

    const isImage = ["gif", "jpeg", "jpg", "png", "svg", "webp"].includes(metadata.filename.replace(regex, ""))

    if (isImage) {
      const width = +(url.searchParams.get("width") as string) || 500
      const height = +(url.searchParams.get("height") as string) || 500

      const imageStream = stream.pipe(sharp().resize(width, height))
      return new Response(imageStream as unknown as BodyInit, responseOptions)
    }
  }

  return new Response(stream as unknown as BodyInit, responseOptions)
}
