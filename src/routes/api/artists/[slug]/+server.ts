import { mongoWrapper } from "$api/db.server"
import { error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (async ({ params }) => {
  const artist = await mongoWrapper.findArtist(params.slug)
  if (!artist) throw error(404)

  return new Response(JSON.stringify(artist))
}) satisfies RequestHandler
