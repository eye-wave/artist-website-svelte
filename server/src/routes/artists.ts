import { db } from "../db"
import { listAllWrapper } from "./listAllWrapper"
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

artistsRoute.post("/list",(req,res) => listAllWrapper(req,res,false,"artists"))
