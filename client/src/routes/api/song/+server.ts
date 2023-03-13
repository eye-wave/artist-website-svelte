import { error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (({ url, fetch }) => {
  const songId =url.searchParams.get("id")
  if ( !songId ) throw error(401,"Song id not specified")
  if ( songId !== "ui7wvRJZMv1X6hxwmSs5Mg" ) throw error(401,"Song id not supported")

  const response ={
    name: "19Tet Lick",
    artists: ["Eyewave"],
    duration: 3000,
    album: "",
    cover: "fw6HfIaawfgRGRfH917aqA",
    filesize: 156000,
  }

  return new Response(JSON.stringify(response))
}) satisfies RequestHandler
