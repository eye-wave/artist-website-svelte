
export enum WaveshaperCurveType {
  SOFT_CLIP,
  HARD_CLIP,
  LINEAR_FOLD
}

export type WaveShaperOptions ={
  wet?: number,
  dry?: number
  curveType?: WaveshaperCurveType,
  intensity?: number
}

export function generateDistortionCurve( intensity: number, type: WaveshaperCurveType, resolution =1000 ): Float32Array {
  const curve: Float32Array =new Float32Array(resolution).fill(0).map((_, i) => (i / (resolution - 1)) * 2 - 1)

  switch ( type ) {
    case WaveshaperCurveType.SOFT_CLIP:
      return curve.map(x => Math.tanh(x * intensity))

    case WaveshaperCurveType.HARD_CLIP:
      return curve.map(x => Math.max(-1, Math.min(1, x *intensity)))

    case WaveshaperCurveType.LINEAR_FOLD:
      return curve.map(x => {
        const y =Math.PI / 2 *x *intensity
        return (2 / Math.PI) *Math.asin(Math.sin(y))
      })

    default:
      return curve
  }
}

export type WaveShaperNode =ReturnType<typeof createWaveShaperNode>
export function createWaveShaperNode(  context: AudioContext ) {
  const inputNode = context.createGain()
  const dryGainNode = context.createGain()
  const wetGainNode = context.createGain()
  const waveshaperNode = context.createWaveShaper()
  
  const resolution =184
  let intensity =1
  let curveType =WaveshaperCurveType.HARD_CLIP

  waveshaperNode.curve =generateDistortionCurve(intensity,curveType,resolution)

  inputNode.connect(waveshaperNode)
  inputNode.connect(dryGainNode)
  waveshaperNode.connect(wetGainNode)

  return {
    get node() { return inputNode },
    get dry() { return dryGainNode },
    get wet() { return wetGainNode },

    get intensity() { return intensity },
    set intensity(input:number) {
      intensity =input
      waveshaperNode.curve =generateDistortionCurve(intensity,curveType,resolution)
    },

    get curveType() { return curveType },
    set curveType(input:WaveshaperCurveType ) {
      curveType =input
      waveshaperNode.curve =generateDistortionCurve(intensity,curveType,resolution)
    },
    
    setDryAtTime( value:number, startTime =0 ) {
      dryGainNode.gain.setValueAtTime( value, startTime )
      return this
    },
    
    setWetAtTime( value:number, startTime =0 ) {
      wetGainNode.gain.setValueAtTime( value, startTime )
      return this
    },

    connect( destinationNode: AudioNode ) {
      dryGainNode.connect( destinationNode )
      wetGainNode.connect( destinationNode )
      return this
    },
    disconnect() {
      dryGainNode.disconnect()
      wetGainNode.disconnect()
      return this
    },
  }
}
