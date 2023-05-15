import { error } from "@sveltejs/kit"
import { mongoWrapper } from "../../../db.server"
import type { RequestHandler } from "./$types"

export const GET = (async ({ params }) => {
  const fileId = params.slug

  if (fileId === "undefined") throw error(404)
  if (fileId === "null") throw error(404)
  if (fileId === "") throw error(404)

  const something = await mongoWrapper.downloadFile(fileId)

  return new Response(something)
}) satisfies RequestHandler
