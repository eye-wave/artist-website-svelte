
export type WaveShaperOptions ={
  curve?: Float32Array,
  wet?: number,
  dry?: number
}

export type WaveShaperNode =ReturnType<typeof createWaveShaperNode>
export function createWaveShaperNode(  context: AudioContext ) {
  const inputNode = context.createGain()
  const dryGainNode = context.createGain()
  const wetGainNode = context.createGain()
  const waveshaperNode = context.createWaveShaper()
  waveshaperNode.curve =new Float32Array([-1,1])

  inputNode.connect(waveshaperNode)
  inputNode.connect(dryGainNode)
  waveshaperNode.connect(wetGainNode)

  return {
    get node() { return inputNode },
    get dry() { return dryGainNode },
    get wet() { return wetGainNode },

    setCurve( curve:Float32Array ) {
      waveshaperNode.curve =curve
      return this
    },
    setDryAtTime( value:number, startTime =0 ) {
      dryGainNode.gain.setValueAtTime( value, startTime )
      return this
    },
    setWetAtTime( value:number, startTime =0 ) {
      wetGainNode.gain.setValueAtTime( value, startTime )
      return this
    },
    setDryWetAtTime( dry:number, wet:number, startTime =0 ) {
      dryGainNode.gain.setValueAtTime( dry, startTime )
      wetGainNode.gain.setValueAtTime( wet, startTime )
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
