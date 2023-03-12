#!/usr/bin/env node
const fs =require("fs")
const path =require("path")
const { spawn } =require("child_process")
const { colorizeString, logErrorAndExit, createFileAndLogSuccess, getTypeFromString } =require("./utils.cjs")
const [ ,,storeName,defaultValue ] =process.argv

if ( !storeName )
  logErrorAndExit("Store name is required")

if ( !storeName.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/) )
  logErrorAndExit("Invalid store name")

const storeFolder =path.join(__dirname,"..","client/src/stores")
const filePath = path.join(storeFolder,`${storeName}.ts`)
const fileParent =path.join(filePath,"..")

if ( fs.existsSync(filePath))
  logErrorAndExit("Store already exists")


if ( !fs.existsSync(fileParent) )
  fs.mkdirSync(fileParent,{ recursive:true })


let value =defaultValue !== undefined ? defaultValue : 0
const valueType =getTypeFromString(value)
createFileAndLogSuccess(filePath,`import { writable } from "svelte/store"

export const ${storeName}Store =writable<${valueType}>(${valueType === "string" ? JSON.stringify(value) : value})
`,4)

spawn(`code ${filePath}`,{shell: true})
