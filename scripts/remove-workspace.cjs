#!/usr/bin/env node
const fs =require("fs")
const [ ,,workspaceName ] =process.argv
const { colorizeString, logErrorAndExit } =require("./utils.cjs")

const packageJsonRaw =fs.readFileSync("package.json", "utf8")
let packageJson

if (!packageJsonRaw)
  logErrorAndExit("package.json file not found.")

try { packageJson =JSON.parse(packageJsonRaw) }
catch (_) { logErrorAndExit("package.json is malformed.") }

if (!workspaceName)
  logErrorAndExit("No workspace name specified.")

if (!fs.existsSync(workspaceName))
  logErrorAndExit(`Directory "${colorizeString(workspaceName,2)}" does not exist.`)

fs.rmSync(workspaceName,{ recursive: true, force: true })

const workspacesSet =new Set(packageJson.workspaces?.filter(x => x !== workspaceName) || [])
const workspacesCorrected =Array.from(workspacesSet)
packageJson.workspaces =workspacesCorrected

fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2))
console.log(`Workspace "${colorizeString(workspaceName,2)}" ${colorizeString("removed",1)} successfully.`)
