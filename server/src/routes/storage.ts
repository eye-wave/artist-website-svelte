import "dotenv/config"
import { filemap } from "../filemap"
import { Router } from "express"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"
import url from "node:url"

const NULL_IMAGE =process.env.NULL_IMAGE
const AUTH =process.env.AUTH

export const storageRoute =Router()
storageRoute.get("/file/:id",(req,res) => {
  try {
    const { id } =req.params
    let filePath =filemap.get(id)
    
    if ( id === "null" || id === "undefined" ) filePath =NULL_IMAGE
    if ( !filePath ) return res.sendStatus(404).end()

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
      case "webp": {

        res.setHeader("Content-Type","image/webp")

        const width  =+(params.get("width") || 192)
        const height =+(params.get("height") || 192)

        if ( !fs.existsSync(filePath) ) {
          res.status(404).end()
          return
        }
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

      case "mp3":
      case "wav":
      case "opus":
      {
        res.setHeader("Content-Type",`audio/${fileExt === "mp3" ? "mpeg" : fileExt}`)

        const isWaveform =params.get("waveform") === "true" || false
        if ( !isWaveform ) break

        const resolution =+(params.get("res") || 100)

        const audioData =spawnSync(`ffprobe -hide_banner -loglevel panic -show_format -show_streams ${filePath}`,{shell:true}).stdout.toString()
        const audioLength =parseFloat(audioData.match(/(?:duration=)([\d\.]+)/)?.[1] || "0")
        const audioSamplerate =parseInt(audioData.match(/(?:sample_rate=)(\d+)/)?.[1] || "44100")
        const spp =Math.floor(audioSamplerate * audioLength /resolution)

        const stdout =spawnSync(`audiowaveform -i ${filePath} --bits 8 --zoom ${spp} -q --output-format json`,{shell:true}).stdout.toString() 
        const { data } =JSON.parse(stdout) as { data: number[] }
        const ui8 =new Int8Array([0,...data.map(n => Math.floor(Math.abs(n)) / 256 * 32 ),0])

        res.setHeader("Content-Type","octet-stream")
        res.end(Buffer.from(ui8))

        // TODO add svg flag to make ssr faster ( no need to include d3 in client code )

        return
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
