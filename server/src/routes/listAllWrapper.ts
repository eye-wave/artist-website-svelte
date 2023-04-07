import { db } from "../db"
import type { Request, Response } from "express"

const AUTH =process.env.AUTH

export function listAllWrapper(req:Request,res:Response,auth:boolean,tableName:string) {
  try {
    if ( auth ) {
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
