import express from "express"
import type { Request, Response, NextFunction } from "express"
import { storageRoute, releasesRoute, demosRoute, shitpostRoute } from "./routes"

function logger(req:Request,res:Response,next:NextFunction) {
  console.log(`~> Received ${req.method} on ${req.url}`)
  console.log(`~> Sent ${res.statusCode} on ${req.url}`)
  next()
}

const app =express()

app.use(logger)
app.use("/storage",storageRoute)
app.use("/releases",releasesRoute)
app.use("/wip",demosRoute)
app.use("/shitpost",shitpostRoute)
app.use((_,res) => res.sendStatus(404))

app.listen(3000)
