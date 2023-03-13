

export function getCoordinatesFromEvent(e:MouseEvent|TouchEvent) {
  let x =NaN
  let y =NaN

  if ( e.type.includes("mouse") || e.type.includes("click") ) {
    x =(e as MouseEvent).pageX
    y =(e as MouseEvent).pageY
  }
  else {
    x =(e as TouchEvent)?.touches?.[0]?.pageX || 0
    y =(e as TouchEvent)?.touches?.[0]?.pageY || 0
  }


  return {x,y}
}
