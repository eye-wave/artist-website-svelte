

const width =10
const height =10


type Point ={ x:number, y:number }
type Line ={ p1:Point, p2:Point, angle: number }

let curvePoints:Point[] =[{x:0,y:0},{x:width,y:height}]


function pointsToFloat32(points:Point[],width:number,height:number) {
  const arr:number[] =[]
  points.reduce((prev,curr) => {
    const angle =Math.atan2(curr.y -prev.y, curr.x -prev.x)
    
    arr.push(prev.y)
    for ( let x =prev.x; x < curr.x; x++ ) {
      const deltaX =curr.x -x
      const deltaY =(deltaX * Math.sin(angle)) /Math.cos(angle)
      arr.push(curr.y -deltaY)
    }
    arr.push(curr.y)

    return curr
  })

  const curve =arr.map(i => (height -i) /height)
  return new Float32Array([...curve,...curve.map(i => -i).reverse()].reverse())
}

console.log(pointsToFloat32(curvePoints,width,height))
