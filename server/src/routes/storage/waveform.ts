import type { Response } from "express"
import { spawnSync } from "node:child_process"
import { scaleLinear } from "d3-scale"
import { line, curveBumpY as curve } from "d3-shape"

type Point2D = { x: number, y: number }

export function handleWaveform(res:Response,params:URLSearchParams,filePath:string) {
  const isWaveform =params.get("waveform") === "true" || false
  if ( !isWaveform ) return false

  const resolution =+(params.get("res") || 100)
  const width =+(params.get("width") || 800)
  const height =+(params.get("width") || 200)

  const audioData =spawnSync(`ffprobe -hide_banner -loglevel panic -show_format -show_streams ${filePath}`,{shell:true}).stdout.toString()
  const audioLength =parseFloat(audioData.match(/(?:duration=)([\d\.]+)/)?.[1] || "0")
  const audioSamplerate =parseInt(audioData.match(/(?:sample_rate=)(\d+)/)?.[1] || "44100")
  const spp =Math.floor(audioSamplerate * audioLength /resolution)

  const stdout =spawnSync(`audiowaveform -i ${filePath} --bits 8 --zoom ${spp} -q --output-format json`,{shell:true}).stdout.toString() 
  const { data } =JSON.parse(stdout) as { data: number[] }
  const ui8 =new Int8Array([0,...data.map(n => Math.floor(Math.abs(n)) / 256 * 32 ),0])
  
  const svg =params.get("svg") === "true" || false
  if ( !svg ) {
    res.setHeader("Content-Type", "octet-stream")
    res.end(Buffer.from(ui8))
    return true
  }

  const waveform =convertToPoint2DArray(ui8)

  const x =scaleLinear()
    .domain([0,ui8.length])
    .range([0,width])

  const y1 =scaleLinear()
    .domain([32,0])
    .range([0,height /2])

  const y2 =scaleLinear()
    .domain([0,32])
    .range([height/2,height])

  const lineGenerator1 =line<Point2D>()
    .x(d => x(d.x))
    .y(d => y1(d.y))
    .curve(curve)

  const lineGenerator2 =line<Point2D>()
    .x(d => x(d.x))
    .y(d => y2(d.y))
    .curve(curve)

  res.setHeader("Content-Type","text/plain")
  res.end([lineGenerator1(waveform),lineGenerator2(waveform)].join("").replace(/\.\d+/g,""))

  return true
}



function convertToPoint2DArray(input: Int8Array): Point2D[] {
  const point2DArray: Point2D[] = []

  for (let i = 0; i < input.length; i++) {
    const currentNumber = input[i]
    const diffPrev =Math.abs(currentNumber -input[i -1])
    const diffNext =Math.abs(currentNumber -input[i +1])
    const diff = diffPrev + diffNext

    if ( i > 0 && i < input.length && diff < 1 ) continue

    const point2D: Point2D = { x: i, y: currentNumber }
    point2DArray.push(point2D)
  }

  point2DArray.unshift({x:0,y:0})
  point2DArray.push({x:input.length,y:0})

  return point2DArray
}
