import { db } from "../db"
import { listAllWrapper } from "./utils/listAllWrapper"
import { Router } from "express"

export const releasesRoute =Router()
releasesRoute.get("/song/:id",(req,res) => {
  try {
    const { id } =req.params
    const record =db.released.get(id)

    if ( !record ) res.sendStatus(404).end()

    res.json(record)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
})

releasesRoute.get("/artist/:id",(req,res) => {
  try {
    const { id } =req.params
    const record =db.artists.get(id)

    if ( !record ) res.sendStatus(404).end()

    res.json(record)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
})

releasesRoute.get("/list",(_,res) => listAllWrapper(res,"released"))

// TODO add release upload with basic auth
