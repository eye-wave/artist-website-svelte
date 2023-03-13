
export type FetchedTrack ={
  name: string,
  artists: string[],
  duration: number,
  album?: string,
  cover: string,
  filesize: number,
}
export type TrackMapEntry ={
  blobUrl: string,
  id: string
} & FetchedTrack

export function createTrackMap() {
  const map =new Map<string,TrackMapEntry>()

  return {
    get( id:string ) { return map.get(id) },
    has( id:string ) { return map.has(id) },
    add( id:string, song:TrackMapEntry ) {
      map.set(id,song)
      return this
    },
    delete( id:string ) {
      if ( !map.has(id) ) return this
      map.delete( id )
      return this
    },

    get largestEntry() {
      let entry:TrackMapEntry|undefined
      Array.from(map.entries()).forEach(([_,song]) => entry =(entry?.filesize || 0) > song.filesize ? entry : song)
      return entry
    },
    get totalSize() {
      let totalSize =0
      map.forEach(song => totalSize += song.filesize)
      return totalSize
    }
  }
}
