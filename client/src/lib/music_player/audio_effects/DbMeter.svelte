<script lang="ts">
  import { musicPlayer } from "../../MusicPlayer.svelte"
  import * as d3 from "d3"
  import { onMount, onDestroy } from "svelte"
  import { browser } from "$app/environment"
  // TODO add vendor script to prevent loading entire d3 package
  // and maybe test if that's even worth trying
  // or even >:) steal fancy trigonometry functions from d3


  let canvas:HTMLCanvasElement
  let ctx:CanvasRenderingContext2D
  let animationId =-1
  let fftSize =8192

  $: if ( musicPlayer.audioEffects ) musicPlayer.audioEffects.analyzer.fftSize =fftSize

  // TODO remove width and height in favor of boundingRect for responsive canvas
  export let width =500
  export let height =180
  export let bufferSize =50
  export let curveSteepness =6
  $: buffer =new Uint8Array(bufferSize +1)

  $: x =d3.scaleLinear()
    .domain([0,bufferSize])
    .range([0,width])

  $: y =d3.scaleLinear()
    .domain([255,0])
    .range([0,height])

  $: lineGenerator =d3.line<Point>()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .curve(d3.curveBasis)


  onDestroy(() => browser && cancelAnimationFrame(animationId))
  onMount(() => {
    ctx =canvas.getContext("2d")!
    ctx.strokeStyle ="#fff"
    ctx.lineWidth =2
    ctx.lineJoin ="round"
    ctx.lineCap ="round"
    ctx.fillStyle ="#000"

    animationId =requestAnimationFrame( animate )

    // TODO create db meter component ( check fl studio first for correct settings )
    // TODO create oscilloscope component
  })

  function animate() {
    if ( musicPlayer.audioEffects?.analyzer ) {
      musicPlayer.audioEffects.analyzer.getByteFrequencyData(buffer)
      const points =[0,...buffer.slice(3),0].map((Y,x) => {
        const y =Math.pow(Y,curveSteepness) /Math.pow(255,curveSteepness -1)
        return { x,y }
      })

      const path =new Path2D(lineGenerator(points) || "")

      ctx.fillRect(0,0,width,height)
      ctx.stroke(path)

    }

    requestAnimationFrame(animate)
  }
  

</script>

<div class="h-96">
  <canvas {width} {height} bind:this={canvas}>
    Your browser does not support the canvas tag
  </canvas>
</div>