export type shortFetchOutputType ="json" | "text" | "blob" | "arrayBuffer" | "audioUrl"

export async function shortFetch( input: string, output: shortFetchOutputType, init?: RequestInit ): Promise<unknown> {
  const response = await fetch(input, init)

  if (output === "audioUrl") {
    const buffer = await response.arrayBuffer()
    const blob = new Blob([buffer], { type: "audio/mp3" })
    const blobUrl = URL.createObjectURL(blob)

    return blobUrl
  }

  try { return await response[output]() }
  catch (error) { throw new Error(`Failed to parse response as ${output}: ${error}`) }
}
