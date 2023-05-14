export type ReverbOptions = {
  wet?: number
  dry?: number
}

export type ReverbNode = ReturnType<typeof createReverbNode>
export function createReverbNode(context: AudioContext) {
  const convolverNode = context.createConvolver()
  const dryGainNode = context.createGain()
  const wetGainNode = context.createGain()
  const inputNode = context.createGain()

  return {
    get node() {
      return inputNode
    },
    get hasBuffer() {
      return !!convolverNode.buffer
    },

    setDryAtTime(value: number, startTime = 0) {
      dryGainNode.gain.setValueAtTime(value, startTime)
      return this
    },
    setWetAtTime(value: number, startTime = 0) {
      wetGainNode.gain.setValueAtTime(value, startTime)
      return this
    },
    async loadImpulseResponse(fileUrl: string) {
      return new Promise<void>((resolve, reject) => {
        fetch(fileUrl)
          .then(response => response.arrayBuffer())
          .then(buffer => context.decodeAudioData(buffer))
          .then(audioBuffer => (convolverNode.buffer = audioBuffer))
          .then(() => {
            inputNode.connect(dryGainNode)
            inputNode.connect(convolverNode)
            convolverNode.connect(wetGainNode)

            return resolve()
          })
          .catch(reject)
      })
    },

    disconnect() {
      dryGainNode.disconnect()
      wetGainNode.disconnect()
      return this
    },
    connect(destinationNode: AudioNode) {
      dryGainNode.connect(destinationNode)
      wetGainNode.connect(destinationNode)
      return this
    },
  }
}
