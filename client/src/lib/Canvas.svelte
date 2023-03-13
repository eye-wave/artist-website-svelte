<script lang="ts">
  import { onMount } from "svelte"
  import object from "./assets/monkey.json"

  const width =1000
  const height =1000
  const cameraRotation ={
    x:Math.PI /4,
    y:Math.PI /4,
    z:Math.PI /4,
  }

  const { indices, vertices } =object

  function mapVertex(vertex,fov =100) {
    const [x,y,z] =vertex
    
    const scale = fov / (z + fov) *50
    const x2d = (x - y) * scale
    const y2d = (x + y - 2 * z) * scale
    
    return [Math.floor(x2d + canvas.width / 2), Math.floor(y2d + canvas.height / 2)]
  }

  function drawObject(vertices, indices, color="#4190a250") {
    ctx.fillStyle = color
    // ctx.strokeStyle =color

    for (let i = 0; i < indices.length; i += 3) {
      const vertex1 = vertices[indices[i]]
      const vertex2 = vertices[indices[i + 1]]
      const vertex3 = vertices[indices[i + 2]]
      const point1 = mapVertex(vertex1)
      const point2 = mapVertex(vertex2)
      const point3 = mapVertex(vertex3)

      ctx.beginPath()
      ctx.moveTo(point1[0], point1[1])
      ctx.lineTo(point2[0], point2[1])
      ctx.lineTo(point3[0], point3[1])
      ctx.closePath()
      ctx.fill()
      // ctx.stroke()
    }
  }



  function rotateX(vertex, a) {
    const y = vertex[1] * Math.cos(a) - vertex[2] * Math.sin(a)
    const z = vertex[1] * Math.sin(a) + vertex[2] * Math.cos(a)
    return [vertex[0], y, z]
  }


  function rotateY(vertex, a) {
    const x = vertex[0] * Math.cos(a) + vertex[2] * Math.sin(a)
    const z = -vertex[0] * Math.sin(a) + vertex[2] * Math.cos(a)
    return [x, vertex[1], z]
  }

  function rotateZ(vertex, a) {
    const x = vertex[0] * Math.cos(a) - vertex[1] * Math.sin(a)
    const y = vertex[0] * Math.sin(a) + vertex[1] * Math.cos(a)
    return [x, y, vertex[2]]
  }

  let canvas:HTMLCanvasElement
  let ctx:CanvasRenderingContext2D
  let angle =0

  function animate(ms:number) {
    if ( !ctx ) return
    requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawObject(vertices.map(vertex => rotateX(rotateY(rotateZ(vertex,cameraRotation.z),cameraRotation.y),cameraRotation.x)),indices)
    drawObject([[-100,0,0],[100,0,0]].map(vertex => rotateX(rotateY(rotateZ(vertex,cameraRotation.z),cameraRotation.y),cameraRotation.x)),[1,0,0],"#f00")
    drawObject([[0,-100,0],[0,100,0]].map(vertex => rotateX(rotateY(rotateZ(vertex,cameraRotation.z),cameraRotation.y),cameraRotation.x)),[1,0,0],"#0f0")
    drawObject([[0,0,-100],[0,0,100]].map(vertex => rotateX(rotateY(rotateZ(vertex,cameraRotation.z),cameraRotation.y),cameraRotation.x)),[1,0,0],"#00f")

    angle += 0.01
  }

  onMount(() => {
    ctx =canvas.getContext("2d")!

    requestAnimationFrame(animate)
    
  })

</script>

<canvas bind:this={canvas} {width} {height}></canvas>

<input min={0} step={0.1} max={Math.PI *2} bind:value={cameraRotation.x} type="range" name="rotateX"> <label for="rotateX">rotateX</label>
<input min={0} step={0.1} max={Math.PI *2} bind:value={cameraRotation.y} type="range" name="rotateY"> <label for="rotateY">rotateY</label>
<input min={0} step={0.1} max={Math.PI *2} bind:value={cameraRotation.z} type="range" name="rotateZ"> <label for="rotateZ">rotateZ</label>

<style lang="postcss">

</style>
