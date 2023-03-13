<script lang="ts">
  import { browser } from "$app/environment"
  import { rng } from "src/utils/random"
  import { onDestroy, onMount } from "svelte"

  let animationId =-1
  // let clientRect: DOMRect
  let width =0
  let height =300
  let canvas:HTMLCanvasElement
  let ctx:CanvasRenderingContext2D

  type Particle ={
    id: number,
    position: {
      x: number,
      y: number,
    },
    velocity: {
      x: number,
      y: number,
    },
    connected: Particle[]
  }

  const friction = 0.98
  const points:Particle[] =[]


  function onResize() {
    if ( !canvas ) return
    width =window.innerWidth
    height =400

    // clientRect =canvas.getBoundingClientRect()
  }

  onDestroy(() => browser && cancelAnimationFrame(animationId))
  onMount(() => {

    onResize()

    const cellSize =50
    const length =Math.ceil(width /cellSize) *Math.ceil(height /cellSize)
    
    console.log(cellSize,width,height)
    
    Array.from({ length }).forEach((_,i) => points.push({
      id: i^9,
      position: {
        x: (i % Math.floor(width /cellSize)) *cellSize,
        y: Math.floor(i /Math.floor(width /cellSize)) *cellSize,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      connected: [] as any[]
    }))
    
    ctx =canvas.getContext("2d")!
    animationId =requestAnimationFrame(animate)
  })

  function animate(ms:number) {
    if ( !ctx ) return cancelAnimationFrame(animationId)

    ctx.fillStyle ="#00000020"
    ctx.strokeStyle ="#ffffff20"
    
    ctx.fillRect(0,0,width,height)
    points.forEach(point => {
      point.position.x += point.velocity.x * friction // * ms / 1000
      point.position.y += point.velocity.y * friction // * ms / 1000

      if ( point.position.x < 0 ) point.position.x =width
      if ( point.position.x > width ) point.position.x =0
      if ( point.position.y < 0 ) point.position.y =height
      if ( point.position.y > height ) point.position.y =0

      ctx.fillStyle ="#ffffff20"

      ctx.beginPath()
      ctx.arc(point.position.x,point.position.y,3,0,Math.PI*2)
      ctx.fill()
    })

    // requestAnimationFrame(animate)
  }

</script>

<svelte:window
  on:resize={onResize}/>

<canvas {width} {height}
  bind:this={canvas}></canvas>