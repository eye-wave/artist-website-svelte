import { Router } from "express"
import { db } from "../db"
import { listAllWrapper } from "./listAllWrapper"

export const demosRoute =Router()
demosRoute.get("/song/:id",(req,res) => {
  try {
    const { id } =req.params
    const record =db.demos.get(id,"audioId")

    if ( !record ) res.sendStatus(404).end()

    res.json(record)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
})

demosRoute.post("/list",(req,res) => listAllWrapper(req,res,false,"demos"))

// TODO add song upload with basic auth
