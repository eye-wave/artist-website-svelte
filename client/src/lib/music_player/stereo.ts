
export type PannerNodeOptions ={ width: number }

export type PannerNode =ReturnType<typeof createPannerNode>
export function createPannerNode(  context: AudioContext ) {
  const node =context.createStereoPanner()

  return {
    get node() { return node },

    setWidthAtTime(width:number,startTime =0) {
      node.pan.setValueAtTime(width,startTime)

      return this
    },

    disconnect() {
      node.disconnect()
      
      return this
    },
    connect( destinationNode:AudioNode ) {
      node.connect(destinationNode)
      
      return this
    },
  }
}
