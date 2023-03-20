import { filemap } from "../filemap"

export function parseExtendedCsv(csvText: string): any[] {
  const lines = csvText
    .replace(/#.*/gm,"")
    .trim()
    .split("\n")

  const headers = parseHeader(lines.shift() || "")
  const rows = lines.map((line) => line.trim().split(","))
  const data = []

  for (const row of rows) {
    const parsedRow: any = {}

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      const value = row[i]?.trim() ?? null

      if (!header) continue

      setObjectProperty(parsedRow, header.name, parseValue(value, header.type))
    }

    data.push(parsedRow)
  }

  return data
}

function parseHeader(headerText: string): Header[] {
  return headerText.trim().split(",").map((header) => {
    const [name, type] = header.split(":")
    return { name, type: type?.trim().toLowerCase() ?? "string" }
  })
}
function setObjectProperty(obj:any, key: string, value: any): void {
  const parts = key.split(".")

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!obj[part]) obj[part] = {}
    obj = obj[part]
  }

  obj[parts[parts.length - 1]] = value
}

function parseValue(value: string | null, type: string):unknown {
  if (value === null || value === "") return null

  // Array check
  if (value.includes(";")) {
    const arrayValues = value.split(";").map((v) => parseValue(v.trim(), type.slice(0, -2))).filter(i=>i!==null)
    return arrayValues
  }

  if ( type === "file" ) {
    for ( let [key,val] of filemap ) {
      if ( value === val ) {
        return key
      }
    }

    return null
  }

  if (type === "boolean") {
    if (value === "true") return true
    if (value === "false") return false
    return null
  }

  if (type === "number") {
    const numberValue = Number(value)
    if (!isNaN(numberValue)) return numberValue
    return null
  }

  return value
}

type Header = { name: string; type: string };





// export function createHeaderFromRecord<T extends {[key:string]:unknown}>(input:T) {
//   const headers =new Set()

//   Object.keys(input).forEach(key => {
//     const item = input[key]
//     const type =getType(item)

//     if ( type === "object" ) {
//       const _headers =createHeaderFromRecord(item as {})
//       const array =Array.from(_headers).map(_key => `${key}.${_key}`)

//       array.forEach(key => headers.add(key))
      
//       return
//     }

//     if ( type === "string" ) return headers.add(key)
//     return headers.add(`${key}:${type}`)
//   })



//   return headers
// }

// function getType( item:unknown ):string {
//   const type =typeof item
//   switch ( type ) {
//     case "number":
//     case "bigint": return "nubmer"
//     case "boolean": return "boolean"
//     case "object": {
//       if ( Array.isArray(item) ) return getType(item?.[0]) +"[]"
//       return "object"
//     }
    
//     default: return "string"
//   }
// }
