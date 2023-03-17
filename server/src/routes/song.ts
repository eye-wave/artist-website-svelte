// TODO future me will clean up this mess
// with love: past me ♥

// import { error } from "@sveltejs/kit"
// import type { RequestHandler } from "./$types"

// export const GET = (({ url, fetch }) => {
//   const songId =url.searchParams.get("id")
//   if ( !songId ) throw error(401,"Song id not specified")
//   if ( songId !== "ui7wvRJZMv1X6hxwmSs5Mg" ) throw error(401,"Song id not supported")

//   const response ={
//     name: "19Tet Lick",
//     artists: ["Eyewave"],
//     duration: 3000,
//     album: "",
//     cover: "fw6HfIaawfgRGRfH917aqA",
//     filesize: 156000,
//   }

//   return new Response(JSON.stringify(response))
// }) satisfies RequestHandler

import { Router } from "express"
// import { db } from "../db"
// import { listAllWrapper } from "./listAllWrapper"

export const songRoute =Router()
songRoute.get("/:id",(req,res) => {
  // try {
  //   const { id } =req.params
  //   const record =db.released.get(id)

  //   if ( !record ) res.sendStatus(404).end()

  //   res.json(record)
  // }
  // catch ( err ) {
  //   console.log( err )
  //   res.sendStatus(502).end()
  // }

  res.json({
    name: "Garbage song",
    artists: ["Eyewave"],
    duration: 3000,
    album: "",
    cover: "T7irmDw7Tyb0EZR-GcYcjw",
    filesize: 156000,
  }).end()
})
