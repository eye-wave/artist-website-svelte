import type { Request, Response } from "express"
import { db } from "../db"

const AUTH =process.env.AUTH

export function listAllWrapper(req:Request,res:Response,auth:boolean,tableName:string) {
  try {
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

    res.json(table.data)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
}
