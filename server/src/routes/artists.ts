import { db } from "../db"
import { listAllWrapper } from "./utils/listAllWrapper"
import { Router } from "express"

export const artistsRoute =Router()
artistsRoute.get("/get/:name",(req,res) => {
  try {
    const { name } =req.params
    const record =db.artists.get(name,"name")

    if ( !record ) res.sendStatus(404).end()

    res.json(record)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
})

artistsRoute.get("/list",(_,res) => listAllWrapper(res,"artists"))
