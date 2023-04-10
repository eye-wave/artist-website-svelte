export function parseCSV(input: string, customTypes:CustomTypeDefinition[] =[]){
  input =input.replace(/#.*\n?/g,"").trim()
  const [ rawHeaders ] =input.match(/.*/) || []
  
  if ( !rawHeaders ) throw new Error("File empty")

  const schema =getSchemaFromCSV(rawHeaders)
  const rows =input.split("\n").slice(1)

  return rows.map(row => parseRowWithSchema(row,schema,customTypes))
}

export type CustomTypeDefinition ={
  name: string,
  parse: (input:string) => unknown
}

function parseItemWithType(input:string, type:string, customTypes:CustomTypeDefinition[] =[]):any {
  if ( type.endsWith("[]" ) ) {
    const nestedType =type.slice(0,-2)
    return input
      .split(";")
      .map(item => parseItemWithType(item,nestedType))
  }

  switch ( type ) {
    case "int": return parseInt(input)
    case "float":
    case "number": return parseFloat(input)
    case "bool":
    case "boolean": return input.toLowerCase() === "true"
  }

  for ( const typedef of customTypes ) {
    if ( type !== typedef.name ) continue
    return typedef.parse(input)
  }

  return input
}

function parseRowWithSchema(row:string, schema:Schema, customTypes:CustomTypeDefinition[] =[]) {
  const obj:any ={}
  row.split(",").forEach((item,i) => {
    const schemaItem =schema.at(i)
    if ( !schemaItem ) return
    
    const nested =schemaItem.tokens.slice(0,-1)
    const lastToken =schemaItem.tokens.at(-1)

    if ( !lastToken ) return

    let nestedObject =obj
    nested.forEach(token => {
      if (!( token in nestedObject )) nestedObject[token] ={}
      nestedObject =nestedObject[token]
    })

    nestedObject[lastToken] =parseItemWithType(item,schemaItem.type,customTypes)
  })

  return obj
}

type Schema =SchemaItem[]
type SchemaItem ={
  type: string,
  tokens: string[]
}

function getSchemaFromCSV(input:string):Schema {
  return input
    .split(",")
    .map(item => {

      const [ rawToken, type ="string" ] =item.split(":")
      const tokens =rawToken.split(".")

      return { type, tokens }
    })
}
