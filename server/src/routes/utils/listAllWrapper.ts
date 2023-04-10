import { db } from "../../db"
import type { Response } from "express"

export function listAllWrapper(res:Response,tableName:string) {
  try {
    const table =db[tableName]
    if ( !table ) throw new Error(`Could not find ${tableName} in database`)

    res.json(table.data)
  }
  catch ( err ) {
    console.log( err )
    res.sendStatus(502).end()
  }
}
