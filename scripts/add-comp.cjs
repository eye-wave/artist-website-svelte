#!/usr/bin/env node
const fs =require("fs")
const path =require("path")
const { spawn } =require("child_process")
const { colorizeString, logErrorAndExit, createFileAndLogSuccess } =require("./utils.cjs")
const [ ,,...args ] =process.argv

let [ compName ] =args?.filter(arg => !arg.startsWith("-")) || []
if ( !compName )
  logErrorAndExit("Component name is required.")

if ( compName.endsWith(".svelte") )
  compName =compName.replace(/\.svelte$/,"")

const compFolder =path.join(__dirname,"..","client/src/lib")

let scriptLang ="ts"
let styleLang ="postcss"
let noStyle =false
let noScript =false
let element ="div"
let _module =false
let forceCreate =false

args.forEach((arg,i) => {
  switch ( arg ) {
    case "--typescript":
    case "-ts":
      return scriptLang ="ts"
    
    case "--javascript":
    case "-js":
      return scriptLang ="js"
    
    case "--css": return styleLang ="css"
    case "--scss": return styleLang ="scss"
    case "--sass": return styleLang ="sass"
    case "--less": return styleLang ="less"
    case "--postcss":
    case "-pcss":
      return styleLang ="postcss"
    
    case "--force":
    case "--overwrite":
    case "-f":
      return forceCreate =true
    
    case "--context":
    case "--module":
    case "-m":
      return _module =true
    
    case "--no-script":
    case "--noscript": return noScript = true
    
    case "--no-style":
    case "--nostyle": return noStyle = true

    case "--element": {
      if ( !args[i +1] ) return
      return element =args[i +1]
    }
  }
})

const filePath = path.join(compFolder,`${compName}.svelte`)
const fileParent =path.join(filePath,"..")

if ( !forceCreate && fs.existsSync(filePath) )
  logErrorAndExit(`Component "${colorizeString(compName,2)}.svelte" already exists.`)

if ( !fs.existsSync(fileParent) )
  fs.mkdirSync(fileParent,{ recursive:true })


  const file_moduleScript =_module ? `<script context="module"${scriptLang !== "js" ? ` lang="${scriptLang}"` : ""}>

</script>\n` : ""

const file_script =`<script${scriptLang !== "js" ? ` lang="${scriptLang}"` : ""}>

</script>`

const file_htmlTemplate =`<${element}>
  ${compName}
</${element}>`

const file_style =`<style${styleLang !== "css" ? ` lang="${styleLang}"` : ""}>

</style>`

const fileContent =`${noScript ? "" : file_moduleScript}${noScript ? "" : file_script}\n\n${file_htmlTemplate}\n\n${noStyle ? "" : file_style}`

createFileAndLogSuccess(filePath,fileContent,1)

spawn(`code ${filePath}`,{shell: true})