import { Router } from "express"
import fs from "node:fs"
import { db } from "../db"
import { listAllWrapper } from "./listAllWrapper"

export const storageRoute =Router()
storageRoute.get("/file/:id",(req,res) => {
  try {
    const { id } =req.params
    const record =db.filemap.get(id)
    const filePath = record.path as string
    const file =fs.readFileSync(filePath)

    res.end(file)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
})

storageRoute.get("/list",(req,res) => listAllWrapper(req,res,true,"filemap"))

// TODO add file upload with basic auth
