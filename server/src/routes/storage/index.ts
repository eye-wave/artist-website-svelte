import "dotenv/config"
import { filemap } from "../../filemap"
import { Router } from "express"
import fs from "node:fs"
import path from "node:path"
import url from "node:url"
import { handleImage } from "./image"
import { handleWaveform } from "./waveform"

const NULL_IMAGE =process.env.NULL_IMAGE
const AUTH =process.env.AUTH

export const storageRoute =Router()
storageRoute.get("/file/:id",(req,res) => {
  try {
    const { id } =req.params
    let filePath =filemap.get(id)
    
    if ( id === "null" || id === "undefined" ) filePath =NULL_IMAGE
    if ( !filePath ) return res.sendStatus(404).end()

    if ( !fs.existsSync(filePath) ) {
      res.status(404).end()
      return
    }

    const parsedUrl =url.parse(req.url)
    const params =new URLSearchParams(parsedUrl.query || "")

    res.setHeader("Connection","close")
    res.setHeader("Cache-Control", "max-age=31536000")
    res.removeHeader("X-Powered-By")
    res.removeHeader("Date")

    const fileExt =path.extname(filePath).replace(/^\./,"")
    switch ( fileExt ) {
      case "gif":
      case "jpeg":
      case "jpg":
      case "png":
      case "webp": return handleImage(res,params,filePath)

      case "mp3":
      case "wav":
      case "opus":
      {
        res.setHeader("Content-Type",`audio/${fileExt === "mp3" ? "mpeg" : fileExt}`)
        if ( handleWaveform(res,params,filePath) ) return
      }
    }

    const data =fs.readFileSync(filePath)
    res.end(data)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
  return
})


storageRoute.post("/list",(req,res) => {
  try {
    if ( !req.body ) {
      res.sendStatus(403).end()
      return
    }
    
    console.log(req.body)
    const [ auth ] =req.body.match(/(?<=:)[\w\d]+$/) || []
    if ( auth !== AUTH ) {
      res.sendStatus(403).end()
      return
    }

    res.json(Array.from(filemap.entries()).map(([id,file]) => ({id,file})))
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
})

// TODO add file upload with basic auth
