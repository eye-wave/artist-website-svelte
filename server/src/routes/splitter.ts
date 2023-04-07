import { Router } from "express"
import fs from "node:fs"
import url from "node:url"

export const splitterRoute =Router()
splitterRoute.get("/",(req,res) => {

  const parsedUrl =url.parse(req.url)
  const params =new URLSearchParams(parsedUrl.query || "")

  const x = +(params.get("x") || 0)
  const y = +(params.get("y") || 0)
  const filePath =`static/splitter/tile_${x}_${y}.webp`

  if ( !fs.existsSync(filePath) ) {
    res.sendStatus(404).end()
    return
  }

  const stream =fs.createReadStream(filePath)
  
  stream.pipe(res)
})
