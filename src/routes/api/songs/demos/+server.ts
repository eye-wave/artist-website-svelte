import { mongoWrapper } from "$api/db.server"
import type { RequestHandler } from "./$types"

export const GET = (async () => {
  const songs = await mongoWrapper.listDemoSongs()

  return new Response(JSON.stringify(songs))
}) satisfies RequestHandler
