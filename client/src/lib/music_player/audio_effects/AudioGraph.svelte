<script lang="ts">
  import { musicPlayer } from ".."
  import { curveBasis, line, scaleLinear } from "d3"
  import { onDestroy, onMount } from "svelte"
  import { browser } from "$app/environment"

  let canvas:HTMLCanvasElement
  let ctx:CanvasRenderingContext2D
  let animationId =-1
  const fftSize =8192
  let domRect:DOMRect
  let div:HTMLDivElement

  $: if ( musicPlayer.audioEffects ) musicPlayer.audioEffects.analyzer.fftSize =fftSize

  $: width =domRect?.width || 200
  $: height =domRect?.height || 48

  export let bufferSize =60
  export let curveSteepness =6
  $: buffer =new Uint8Array(bufferSize)

  $: x =scaleLinear()
    .domain([0,bufferSize])
    .range([0,width])

  $: y =scaleLinear()
    .domain([255,0])
    .range([0,height])

  $: lineGenerator =line<{x:number,y:number}>()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .curve(curveBasis)


  onDestroy(() => browser && cancelAnimationFrame(animationId))
  onMount(() => {
    domRect =div.getBoundingClientRect()
    ctx =canvas.getContext("2d")!
    ctx.fillStyle ="#fff"

    animationId =requestAnimationFrame( animate )
  })

  function animate() {
    if ( animationId < 0 ) return

    if ( musicPlayer.audioEffects?.analyzer ) {
      musicPlayer.audioEffects.analyzer.getByteFrequencyData(buffer)
      const points =[0,...buffer.slice(3),0].map((Y,x) => {
        const y =Math.pow(Y,curveSteepness) /Math.pow(255,curveSteepness -1)
        return { x,y }
      })

      const path =new Path2D(lineGenerator(points) || "")

      ctx.fillStyle ="#fff"
      ctx.clearRect(0,0,width,height)
      ctx.fill(path)

    }

    requestAnimationFrame(animate)
  }

  onDestroy(() => {
    browser && cancelAnimationFrame(animationId)
    animationId = -1
  })
  

</script>

<div class="relative w-52 flex-shrink-0" bind:this={div}>
  <canvas {width} {height} class="w-full h-full relative" bind:this={canvas}>
    Your browser does not support the canvas tag
  </canvas>
</div>