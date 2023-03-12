#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"


const result =fs.readdirSync("src/routes")
  .reduce((result,file) => {
    if ( path.extname(file) !== ".ts" ) return result
    if ( file === "index.ts" ) return result
    if ( file.match(/[A-Z]/)) return result
    
    const moduleName =file.replace(/\.[^\.]+$/,"")

    return result +`export * from "./${moduleName}"\n`

  },"")


fs.writeFile("src/routes/index.ts",result,err => {
  if ( err ) return console.error(err)

  console.log("Successfully generated index.ts in: src/routes/index.ts")
})
