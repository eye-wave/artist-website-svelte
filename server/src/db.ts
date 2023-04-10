import "dotenv/config"
import { CustomTypeDefinition, parseCSV } from "./lib/parseExtendedCsv"
import fs from "node:fs"
import path from "node:path"
import { filemap } from "./filemap"

const DB_PATH =process.env.DB_PATH || "static/db"
const fileType:CustomTypeDefinition ={
  name: "file",
  parse: input => {
    for ( const [key,file] of filemap) {
      if ( file === input ) {
        return key
      }
    }

    return null
  }
}

type Record ={
  id: number|string,
  [key:string]: unknown
}

type Table ={
  readonly name: string,
  readonly data: Record[],
  get: (value:unknown,key?:string) => Record
}

type Database ={
  readonly [name:string]: Table
}


export function createDb(PATH =DB_PATH):Database {
  const tables:Table[] =fs.readdirSync(PATH)
    .filter(file => path.extname(file) === ".csv" )
    .map(file => {
      const newPath =path.join(PATH, file)
      const rawData =fs.readFileSync(newPath,"utf8")
      const data =parseCSV(rawData,[fileType]) as Record[]
      
      return {
        get name() { return file },
        get data() { return [...data] },
        get: (value,key="id") => data.filter(item => item?.[key] === value )?.[0],

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

