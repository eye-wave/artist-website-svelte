import { mongoWrapper } from "../../../db.server"
import type { RequestHandler } from "./$types"

export const GET = (async ({ params }) => {
  const demoSong = await mongoWrapper.findDemoSong(params.slug)

  return new Response(JSON.stringify(demoSong))
}) satisfies RequestHandler
