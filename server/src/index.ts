import express from "express"
import type { Request, Response, NextFunction } from "express"
import { storageRoute, releasesRoute, demosRoute, shitpostRoute } from "./routes"

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
  .use(cors)
  .use("/storage",storageRoute) 
  .use("/releases",releasesRoute)  
  .use("/wip",demosRoute) 
  .use("/shitpost",shitpostRoute)  
  .use((_,res) => res.sendStatus(404))
  .listen(3000)

