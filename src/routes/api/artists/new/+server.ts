import { mongoWrapper } from "$api/db.server"
import { DB_SECRET_KEY } from "$env/static/private"
import { error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const POST = (async ({ url }) => {
  const key = decodeURIComponent(url.searchParams.get("key") || "")
  const name = decodeURIComponent(url.searchParams.get("name") || "")
  const link = decodeURIComponent(url.searchParams.get("url") || "")

  if (key !== DB_SECRET_KEY) throw error(403, "Unable to authorize")

  const searchResult = await mongoWrapper.findArtist(name)
  if (searchResult) throw error(400, "Artist already exists")

  if (!name) throw error(400, "No name specified")
  if (!link) throw error(400, "No url")

  await mongoWrapper.addArtist(name, link, key)

  return new Response("ok")
}) satisfies RequestHandler
