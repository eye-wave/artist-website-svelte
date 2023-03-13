
const frequencyChart =[63,136,294,632,1363,2936,6324]

export type EQBandOptions ={
  type?: BiquadFilterType,
  frequency?: number,
  Q?: number,
  gain?: number,
  disabled?: boolean
}

export type EQNode =ReturnType<typeof createEQNode>
export function createEQNode( context:AudioContext ) {
  const filters: BiquadFilterNode[] =Array.from({ length: 7 }).map((_,i) => {
    const filter = context.createBiquadFilter()
    if ( i === 0 ) filter.type ="lowshelf"
    else if ( i === 6 ) filter.type ="highshelf"
    else filter.type ="peaking"

    filter.frequency.setValueAtTime( frequencyChart[i], 0)

    return filter
  })


  const inputNode =context.createGain()
  const outputNode =context.createGain()

  filters.reduce((prev,curr) => {
    prev.connect( curr )
    return curr
  },inputNode)

  if ( !filters.at(-1) ) console.warn("Failed to find filter at index -1")
  filters.at(-1)?.connect(outputNode)

  return {
    get node(): GainNode { return inputNode },
    get filters() {
      return filters.map(f => ({
        gain: f.gain.value,
        frequency: f.frequency.value,
        Q: f.Q.value,
        type: f.type
      }))
    },

    setBandType( i:number, type:BiquadFilterType ) {
      const band =filters[i]
      if ( !band ) return this
      
      band.type =type
      return this
    },
    setBandGainAtTime( i:number, gain:number, startTime =0 ) {
      const band =filters[i]
      if ( !band ) return this
      
      band.gain.setValueAtTime(gain, startTime)
      return this
    },
    setBandFrequencyAtTime( i:number, frequency:number, startTime =0 ) {
      const band =filters[i]
      if ( !band ) return this
      
      band.frequency.setValueAtTime(frequency, startTime)
      return this
    },
    setBandQAtTime( i:number, q:number, startTime =0 ) {
      const band =filters[i]
      if ( !band ) return this
      
      band.Q.setValueAtTime(q, startTime)
      return this
    },
    disconnect() {
      outputNode.disconnect()
      return this
    },
    connect( destinationNode:AudioNode ) {
      outputNode.connect(destinationNode)
      return this
    },
  }
}
