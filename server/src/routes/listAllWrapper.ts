import type { Request, Response } from "express"
import url from "node:url"
import { db } from "../db"

const AUTH =process.env.AUTH

export function listAllWrapper(req:Request,res:Response,auth:boolean,tableName:string) {
  try {
    const parsedUrl =url.parse(req.url)
    const query =new URLSearchParams(parsedUrl.query || "")
    const sendRawData =query.get("json") === "false" || query.get("raw") === "true"

    if ( auth ) {
      if ( !req.body ) {
        res.sendStatus(403).end()
        return
      }
      
      const [ auth ] =req.body.match(/(?<=:)[\w\d]+$/) || []
      if ( auth !== AUTH ) {
        res.sendStatus(403).end()
        return
      }
    }

    const table =db[tableName]
    if ( !table ) throw new Error(`Could not find ${tableName} in database`)

    if ( sendRawData ) res.end(table.rawData)
    else res.json(table.data)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
}
