import type { Response } from "express"
import sharp from "sharp"
import fs from "node:fs"

export function handleImage(res:Response,params:URLSearchParams,filePath:string) {

  res.setHeader("Content-Type","image/webp")

  const width  =+(params.get("width") || 192)
  const height =+(params.get("height") || 192)

  const stream =fs.createReadStream(filePath)
  const transform =sharp()
    .resize(width,height)
    .flatten()
    .webp()

  stream
    .pipe(transform)
    .pipe(res)
  
  return
}
