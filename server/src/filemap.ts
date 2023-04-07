import "dotenv/config"
import { createHash } from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const SECRET_MESSAGE =process.env.SECRET_MESSAGE || ""

function hash( input:string ) {
  return createHash("md5")
    .update(input)
    .update(SECRET_MESSAGE)
    .digest("base64url")
}

function readdirRecursive( PATH:string, ignore:string[], maxdepth =10 ):string[] {
  if ( maxdepth < 1 ) return []
  return fs.readdirSync( PATH , { withFileTypes: true }).map((item:fs.Dirent) => {
    const newPath =path.join(PATH,item.name)
    
    if ( item.isDirectory() ) {
      if ( ignore.indexOf(item.name) === -1 ) {
        return readdirRecursive( newPath,ignore, maxdepth -1 )
      }
      return []
    }

    return newPath
  }).flat()
}


function createFileMap():Map<string,string> {
  const files =readdirRecursive("static",["db"])
  return new Map(files.map(file => [hash(file),file]) as [string,string][])
}

export const filemap =createFileMap()
