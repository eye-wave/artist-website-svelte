import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { parseExtendedCsv } from "./lib/parseExtendedCsv"

const DB_PATH =process.env.DB_PATH || "static/db"

type Record ={
  id: number|string,
  [key:string]: unknown
}

type Table ={
  readonly name: string,
  readonly path: string,
  readonly rawData: string,
  readonly data: Record[],
  get: (id:number|string) => Record
}

type Database ={ readonly [name:string]: Table }


export function createDb(PATH =DB_PATH):Database {
  const tables:Table[] =fs.readdirSync(PATH)
    .filter(file => path.extname(file) === ".csv" )
    .map(file => {
      const newPath =path.join(PATH, file)
      const rawData =fs.readFileSync(newPath,"utf8")
      const data =parseExtendedCsv(rawData)

      return {
        get name() { return file },
        get rawData() { return rawData },
        get path() { return newPath },
        get data() { return [...data] },
        get: id => data.filter(item => item.id == id )?.[0]

      }
    })
    
  return tables.reduce((db,table) => {
    Object.defineProperty(db,table.name.replace(/\..*/,""),{
      get: function () {
        return table
      },
      enumerable: true
    })

    return db
  },{})
}


export const db =createDb()

