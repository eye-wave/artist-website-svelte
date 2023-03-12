import fs from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"

function hash( input:string ) {
  return createHash("md5")
    .update(input)
    .update("salt")
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


export async function createFileMap() {
  const files =readdirRecursive("static",["db"])
  const csv =files.reduce((csv,file) => {
    const line =`${hash(file)},${file}\n` as string
    process.stdout.write(line)

    return csv +line
  },"id,path\nundefined,static/images/neco_arc.jpeg\n")

  fs.writeFile("static/db/filemap.csv",csv,err => {
    if ( err ) return console.error(err)

    console.log("Successfully generated filemap in: static/db/filemap.csv")
  })
}
