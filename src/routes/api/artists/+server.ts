import { mongoWrapper } from "../db.server"
import type { RequestHandler } from "./$types"

export const GET = (async () => {
  const artists = await mongoWrapper.listArtists()

  return new Response(JSON.stringify(artists))
}) satisfies RequestHandler
