export type shortFetchOutputType ="json" | "text" | "blob" | "arrayBuffer" | "audioUrl"
export type shortFetchResponse =Record<string,unknown> | string | ArrayBuffer | Blob
export async function shortFetch(input:string,output:shortFetchOutputType,init?:RequestInit):Promise<unknown> {
  const response =await fetch(input,init)
  if ( output === "audioUrl" ) {
    const buffer = await response.arrayBuffer()
    const blob = new Blob([buffer],{type:"audio/mp3"})
    const blobUrl =URL.createObjectURL(blob)

    return blobUrl
  }
  return await response[output]()
}
