import { shortFetch } from "src/utils/shortFetch"
import { derived, writable } from "svelte/store"

export type SongMetadata ={
  audioId:string
  metadata: {
    imageId:string,
    title:string,
    artists:string[],
    timestamp:number,
    tags:string[],
  }
  descriptionId:string
}

export type SongQueue =ReturnType<typeof createSongQueue>
export function createSongQueue() {
  const queue:string[] =[]
  const metadataMap: Map<string, SongMetadata> = new Map()
  const songsMap: Map<string,string> = new Map()
  
  let currentSongIndex =0
  const currentSongStore =writable<SongMetadata|null>(null)

  const downloadSongData =async (songId: string) => {
    const audioUrl =await shortFetch(`http://localhost:3000/storage/file/${songId}`,"audioUrl") as string
    const metadata =await shortFetch(`http://localhost:3000/wip/song/${songId}`,"json") as SongMetadata
    
    songsMap.set(songId, audioUrl)
    metadataMap.set(songId,metadata)
  }

  // TODO revoke old songs when memory usage is too high

  return {
    get length() { return queue.length },
    get currentSongId() { return songsMap.get(queue[currentSongIndex]) },
    get isCurrentLast() { return currentSongIndex === queue.length -1 },

    async play( songId: string ) {
      if ( !songsMap.has(songId) ) await downloadSongData(songId)
      currentSongIndex =queue.indexOf(songId)
      
      return songsMap.get(songId)
    },

    next() {
      if ( currentSongIndex < 0 ) return
      if ( queue.length < 1 ) return

      currentSongIndex = ++currentSongIndex % queue.length
      return queue[currentSongIndex]
    },

    prev() {
      if ( currentSongIndex < 0 ) return
      if ( queue.length < 1 ) return

      currentSongIndex = (--currentSongIndex + queue.length) % queue.length
      return queue[currentSongIndex]
    },

    random() {
      if ( currentSongIndex < 0 ) return
      if ( queue.length < 1 ) return

      currentSongIndex =Math.floor(Math.random() * queue.length)
      return queue[currentSongIndex]
    },

    loadQueue(input:string[]) {      
      queue.splice(0,Infinity)
      input.forEach(id => queue.push(id))
    },

    getSongMetadata(songId: string) { return metadataMap.get(songId) },
  }
}

