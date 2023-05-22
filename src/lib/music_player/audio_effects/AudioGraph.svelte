<script lang="ts">
  import { browser } from "$app/environment"
  import { curveBasis, line } from "d3-shape"
  import { musicPlayer } from ".."
  import { onDestroy, onMount } from "svelte"
  import { scaleLinear } from "d3-scale"

  export let bufferSize = 60
  export let curveSteepness = 5

  const fftSize = 8192

  let animationId = -1
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D | null
  let div: HTMLDivElement
  let domRect: DOMRect

  $: if (musicPlayer.audioEffects) musicPlayer.audioEffects.analyzer.fftSize = fftSize
  $: buffer = new Uint8Array(bufferSize)
  $: height = domRect?.height ?? 48
  $: width = domRect?.width ?? 200
  $: x = scaleLinear().domain([0, bufferSize]).range([0, width])
  $: y = scaleLinear().domain([255, 0]).range([0, height])
  $: lineGenerator = line<{ x: number; y: number }>()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .curve(curveBasis)

  onDestroy(() => browser && cancelAnimationFrame(animationId))
  onMount(() => {
    domRect = div.getBoundingClientRect()
    ctx = canvas.getContext("2d")

    if (!ctx) return console.warn("Failed to get canvas context 2d")

    ctx.fillStyle = "#fff"

    animationId = requestAnimationFrame(animate)
  })

  function animate() {
    if (animationId < 0) return
    if (!ctx) return

    if (musicPlayer.audioEffects?.analyzer) {
      musicPlayer.audioEffects.analyzer.getByteFrequencyData(buffer)
      const points = [0, ...buffer.slice(3), 0].map((Y, x) => {
        const y = Math.pow(Y, curveSteepness) / Math.pow(255, curveSteepness - 1)
        return { x, y }
      })

      const path = new Path2D(lineGenerator(points) || "")

      ctx.fillStyle = "#fff"
      ctx.clearRect(0, 0, width, height)
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
  <canvas {width} {height} class="relative h-full w-full" bind:this={canvas}>
    Your browser does not support the canvas tag
  </canvas>
</div>
