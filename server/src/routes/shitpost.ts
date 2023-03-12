import { Router } from "express"
import { db } from "../db"
import { listAllWrapper } from "./listAllWrapper"

export const shitpostRoute =Router()
shitpostRoute.get("/entry/:id",(req,res) => {
  try {
    const { id } =req.params
    const record =db.shitposts.get(id)

    if ( !record ) res.sendStatus(404).end()

    res.json(record)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
})

shitpostRoute.get("/list",(req,res) => listAllWrapper(req,res,true,"shitposts"))

// TODO add entry upload with basic auth
