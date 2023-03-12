#!/usr/bin/env node
const fs =require("fs")
const path =require("path")
const { colorizeString, logErrorAndExit, createFileAndLogSuccess } =require("./utils.cjs")
const [ ,,workspaceName ] =process.argv

// check if workspace name is specified
// and if it already exists

if (!workspaceName)
  logErrorAndExit("No workspace name specified.")

if ( !workspaceName.match(/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/) )
  logErrorAndExit("Invalid workspace name.")

if (fs.existsSync(workspaceName))
  logErrorAndExit(`Directory "${colorizeString(workspaceName,2)}" already exists.`)

// import package.json file and parse it
const packageJsonRaw =fs.readFileSync("package.json", "utf8")
let packageJson

if (!packageJsonRaw)
  logErrorAndExit("package.json file not found.")

try { packageJson =JSON.parse(packageJsonRaw) }
catch (_) { logErrorAndExit("package.json is malformed.") }

const projectName =packageJson.name
if ( !projectName )
  logErrorAndExit("package.json don't have a project name")


// create new workspace directory
const rootDir =path.join(__dirname,"..")
const workspaceDir =path.join(rootDir,workspaceName)

fs.mkdirSync(workspaceDir)

createFileAndLogSuccess(path.join(workspaceDir,"package.json"),`{
  "name": "${workspaceName}",
  "version": "1.0.0",
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -wc",
    "lint": "eslint src/**/*.ts test/**/*.ts --fix",
    "start": "NODE_OPTIONS=--enable-source-maps nodemon ./dist/index.js",
    "test": "vitest"
  },
  "type":"module",
  "devDependencies": {
    "@rollup/plugin-node-resolve": "^15.0.1",
    "@rollup/plugin-terser": "0.4.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@typescript-eslint/eslint-plugin": "^5.49.0",
    "@typescript-eslint/parser": "^5.49.0",
    "eslint": "^8.33.0",
    "nodemon": "*",
    "rollup": "^3.12.0",
    "tslib": "^2.5.0",
    "typescript": "^4.9.4"
  },
  "license": "MIT"
}`,1)

createFileAndLogSuccess(path.join(workspaceDir,".eslintrc.cjs"),`module.exports ={
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended","../.eslintrc.cjs"],
  env: {
    browser: true,
    node: true
  }
}`,5)

createFileAndLogSuccess(path.join(workspaceDir,"tsconfig.json"),`{
	"extends": "../tsconfig.json",
	"compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": [
    "./src/**/*.ts",
    "./test/**/*.ts",
  ],
  "exclude": ["build","dist","node_modules","public","static"]
}`,4)

createFileAndLogSuccess(path.join(workspaceDir,"vitest.config.ts"),`export * from "../vitest.config"`,6)
createFileAndLogSuccess(path.join(workspaceDir,"rollup.config.js"),`import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import pkg from "./package.json" assert { type: "json" }

/** @type {import('rollup').RollupOptions} */
export default {
  input: "./src/index.ts",
  output: {
    name:"index",
    format: "es",
    sourcemap: true,
    dir: "./dist"
  },
  external: ["dotenv/config",...Object.keys(pkg?.dependencies || {})],
  plugins: [
    terser({
      compress: true,
      mangle: true
    }),
    typescript(),
    resolve({ browser: false })
  ]
}`,1)


fs.mkdirSync(path.join(workspaceDir,"src"))
fs.mkdirSync(path.join(workspaceDir,"test"))
createFileAndLogSuccess(path.join(workspaceDir,"src/index.ts"),`console.log(\`Hello from workspace "${workspaceName}"!\`)`,4,4)
createFileAndLogSuccess(path.join(workspaceDir,"test/index.ts"),`console.log(\`Hello from workspace "${workspaceName}"!\`)`,4,4)

// add workspace to package.json
const workspacesSet =new Set([...packageJson.workspaces,workspaceName])
const workspacesCorrected =Array.from(workspacesSet)
packageJson.workspaces =workspacesCorrected

fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2))
