import { Router } from "express"
import fs from "node:fs"
import path from "node:path"
import url from "node:url"
import sharp from "sharp"
import { db } from "../db"
import { listAllWrapper } from "./listAllWrapper"

export const storageRoute =Router()
storageRoute.get("/file/:id",(req,res) => {
  try {
    const { id } =req.params
    const record =db.filemap.get(id)
    if ( !record ) res.sendStatus(404).end()

    const filePath = record.path as string
    const parsedUrl =url.parse(req.url)
    const params =new URLSearchParams(parsedUrl.query || "")

    const stream =fs.createReadStream(filePath)

    res.setHeader("Connection","close")
    res.removeHeader("X-Powered-By")
    res.removeHeader("Date")

    switch ( path.extname(filePath) ) {
      case ".gif":
      case ".jpeg":
      case ".jpg":
      case ".png":
      case ".webp": {

        res.setHeader("Content-Type","image/webp")

        const width  =+params.get("width")! || undefined
        const height =+params.get("height")! || undefined

        const stream =fs.createReadStream(filePath)
        const transform =sharp()
          .resize(width,height)
          .flatten()
          .webp()

        stream.pipe(transform)
      } break

      case ".mp3": res.setHeader("Content-Type","audio/mpeg"); break
      case ".wav": res.setHeader("Content-Type","audio/wav"); break
      case ".opus": res.setHeader("Content-Type","audio/opus"); break
    }

    stream.pipe(res)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
})

storageRoute.get("/list",(req,res) => listAllWrapper(req,res,true,"filemap"))

// TODO add file upload with basic auth
