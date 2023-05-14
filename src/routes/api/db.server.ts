import { DB_SECRET_KEY, MONGODB_URI } from "$env/static/private"
import { GridFSBucket, MongoClient, ObjectId } from "mongodb"
import type { SongMetadata } from "src/lib/music_player/queue"
import type { Stream } from "stream"

function createMongoWrapper() {
  const client = new MongoClient(MONGODB_URI)
  const db = client.db("portfolio")

  const officialSongsCollection =db.collection("OfficialSongs")
  const demoSongsCollection = db.collection("DemoSongs")
  const artistsCollection = db.collection("Artists")
  const fileBucket = new GridFSBucket(db)

  let connectionPromise = client.connect()
  let isConnected = false

  connectionPromise
    .then(() => (isConnected = true))
    .catch(err => {
      console.log(err)
      console.log("Retrying in 30 seconds")

      setTimeout(() => {
        connectionPromise = client.connect()
        connectionPromise.then(() => (isConnected = true))
      }, 30_000)
    })

  return {
    get connectionPromise() {
      return connectionPromise
    },
    get isConnected() {
      return isConnected
    },

    async listArtists() {
      if (!isConnected) return []
      return (await artistsCollection.find().toArray()).map(i => ({ name: i.name, url: i.url }))
    },
    async findArtist(name: string) {
      if (!isConnected) return null

      const results = await artistsCollection.find({ name: new RegExp(name, "i") }).toArray()
      const [artist] = results.filter(a => a.name.toLowerCase() === name.toLowerCase()) || null
      if (!artist) return null
      return { name: artist.name, url: artist.url }
    },
    async addArtist(name: string, url: string, key: string) {
      if (key !== DB_SECRET_KEY) throw Error("Invalid credentials")
      if (!isConnected) throw Error("Connection error")

      const result = await artistsCollection.insertOne({ name, url })
      return result.insertedId
    },

    async uploadFile(input: Buffer, key: string) {
      if (key !== DB_SECRET_KEY) throw Error("Invalid credentials")
      if (!isConnected) throw Error("Connection error")

      const fileName = new ObjectId().toString("base64")
      const uploadStream = fileBucket.openUploadStream(fileName)

      uploadStream.end(input)
      return new Promise<ObjectId>((resolve, reject) => {
        uploadStream.on("error", reject)
        uploadStream.on("finish", () => resolve(uploadStream.id))
      })
    },

    async uploadFileAsStream(stream: Stream, key: string) {
      if (key !== DB_SECRET_KEY) throw Error("Invalid credentials")
      if (!isConnected) throw Error("Connection error")

      const fileName = new ObjectId().toString("base64")
      const uploadStream = fileBucket.openUploadStream(fileName)

      stream.pipe(uploadStream)
      return new Promise<ObjectId>((resolve, reject) => {
        uploadStream.on("error", reject)
        uploadStream.on("finish", () => resolve(uploadStream.id))
      })
    },

    async downloadFile(id: string) {
      const oId = new ObjectId(id)
      const downloadStream = fileBucket.openDownloadStream(oId)

      return new Promise<Buffer>((resolve, reject) => {
        const chunks = [] as Buffer[]

        downloadStream.on("data", d => chunks.push(d))
        downloadStream.on("end", () => resolve(Buffer.concat(chunks)))
        downloadStream.on("error", reject)
      })
    },

    async uploadDemoSong(input: SongMetadata, key: string) {
      if (key !== DB_SECRET_KEY) throw Error("Invalid credentials")
      if (!isConnected) throw Error("Connection error")

      await demoSongsCollection.insertOne(input)
    },

    async findDemoSong(id: string) {
      const song = await demoSongsCollection.findOne({ audioId: id })
      return song
    },

    async listDemoSongs() {
      return demoSongsCollection
        .find()
        .map(item => {
          //@ts-ignore
          delete item._id
          return item
        })
        .toArray()
    },

    async listOfficialSongs() {
      return officialSongsCollection
        .find()
        .map(item => {
          //@ts-ignore
          delete item._id
          return item
        })
        .toArray()
    },

    kill() {
      client.close()
    },
  }
}

export const mongoWrapper = createMongoWrapper()
