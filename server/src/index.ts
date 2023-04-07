/* eslint-disable no-duplicate-imports */
import { artistsRoute, demosRoute, releasesRoute, splitterRoute, storageRoute } from "./routes"
import express from "express"
import type { NextFunction, Request, Response } from "express"

function logger(req:Request,_:Response,next:NextFunction) {
  console.log(`~> Received ${req.method} on ${req.url}`)
  next()
}

function cors(_: Request, res: Response,next: NextFunction) {
  res.setHeader("Access-Control-Allow-Origin","*")
  next()
}

const app =express()

app
  .use(logger)
  .use(express.text())
  .use(cors)
  .use("/artists",artistsRoute)
  .use("/releases",releasesRoute)  
  .use("/split",splitterRoute) 
  .use("/storage",storageRoute) 
  .use("/wip",demosRoute) 
  .use((_,res) => res.sendStatus(404))
  .listen(3000)

