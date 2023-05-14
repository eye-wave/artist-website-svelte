import { lStorage } from "src/utils/localStorage"

export type SongMetadata = {
  audioId: string
  metadata: {
    imageId: string
    title: string
    artists: string[]
    timestamp: number
    tags: string[]
    descriptionId: string
  }
}

export type SongMapItem = {
  url: string
  size: number
  metadata: SongMetadata
}

export type SongQueue = ReturnType<typeof createSongQueue>
export function createSongQueue() {
  const queue: string[] = []
  const songMap: SongMapItem[] = []
  const sizeThreshold = 15 * 1024 ** 2

  let currentSongIndex = 0

  const downloadSongData = async (songId: string) => {
    const promiseArray = [
      new Promise((resolve, reject) => {
        fetch(`/api/storage/file/${songId}`)
          .then(res => res.blob())
          .then(blob =>
            resolve({
              url: URL.createObjectURL(blob),
              size: blob.size,
            }),
          )
          .catch(reject)
      }),
      new Promise<SongMetadata>((resolve, reject) => {
        fetch(`/api/songs/demos/${songId}`)
          .then(res => res.json())
          .then(resolve)
          .catch(reject)
      }),
    ] as [Promise<{ url: string; size: number }>, Promise<SongMetadata>]

    const [audioUrl, metadata] = await Promise.all(promiseArray)
    const song = { metadata, ...audioUrl } as SongMapItem

    lStorage.set("song_cache", songMap)
    songMap.push(song)
    return song
  }

  const getSize = () => {
    let totalSize = 0
    songMap.forEach(song => (totalSize += song.size))
    return totalSize
  }

  const cleanCache = () => {
    let size = getSize()

    while (size > sizeThreshold) {
      size -= songMap[0].size
      URL.revokeObjectURL(songMap[0].url)
      songMap.shift()
      lStorage.set("song_cache", songMap)
    }
  }

  const ping = (blobUrl: string) => {
    return new Promise<boolean>(resolve => {
      fetch(blobUrl)
        .then(res => {
          if (res.ok) return resolve(true)
          resolve(false)
        })
        .catch(() => resolve(false))
    })
  }

  const removeSong = (songId: string) => {
    for (let i = 0; i < songMap.length; i++) {
      if (songMap.at(i)?.metadata.audioId === songId) {
        URL.revokeObjectURL(songMap.at(i)?.url || "")
        songMap.splice(i, 1)

        return 1
      }
    }
    return 0
  }

  // this gets executed on page load
  // TODO yeet this stupid ass cache

  try {
    const songs = lStorage.get("song_cache") as SongMapItem[]
    songs.forEach(song => songMap.push(song))
  } catch {}

  return {
    get length() {
      return queue.length
    },
    get currentSongId() {
      return songMap.filter(song => song.metadata.audioId === queue.at(currentSongIndex))?.at(0)?.metadata.audioId
    },
    get isCurrentLast() {
      return currentSongIndex === queue.length - 1
    },

    async play(songId: string) {
      let [song] = songMap.filter(song => song.metadata.audioId === songId)
      if (!song) song = await downloadSongData(songId)

      const pingSuccess = await ping(song.url)
      if (!pingSuccess) {
        removeSong(songId)
        song = await downloadSongData(songId)
      }

      currentSongIndex = queue.indexOf(songId)

      cleanCache()
      return song
    },

    next() {
      if (currentSongIndex < 0) return
      if (queue.length < 1) return

      currentSongIndex = ++currentSongIndex % queue.length
      return queue.at(currentSongIndex)
    },

    prev() {
      if (currentSongIndex < 0) return
      if (queue.length < 1) return

      currentSongIndex = (--currentSongIndex + queue.length) % queue.length
      return queue.at(currentSongIndex)
    },

    random() {
      if (currentSongIndex < 0) return
      if (queue.length < 1) return

      currentSongIndex = Math.floor(Math.random() * queue.length)
      return queue.at(currentSongIndex)
    },

    loadQueue(input: string[]) {
      queue.splice(0, Infinity)
      input.forEach(id => queue.push(id))
    },

    getSong(songId: string) {
      return songMap.filter(song => song.metadata.audioId === songId)?.[0]
    },
  }
}
