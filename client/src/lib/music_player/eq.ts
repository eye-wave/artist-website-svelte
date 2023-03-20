import { valueToHz } from "src/utils/filters"

const frequencyChart =[82.4,830.6,2637]

export type EQBandOptions ={
  type?: BiquadFilterType,
  frequency?: number,
  Q?: number,
  gain?: number,
  disabled?: boolean
}

function createFilters(context:AudioContext,length =3) {
  return Array.from({ length }).map((_,i) => {
    const filter = context.createBiquadFilter()
    if ( i === 0 ) filter.type ="lowshelf"
    else if ( i === length -1 ) filter.type ="lowpass"
    else filter.type ="peaking"

    filter.frequency.setValueAtTime( frequencyChart[i], 0)
    filter.Q.setValueAtTime(2,0)

    return filter
  })
}

export type EQNode =ReturnType<typeof createEQNode>
export function createEQNode( context:AudioContext ) {
  
  const filters: BiquadFilterNode[] =createFilters(context)
  const demoFilters: BiquadFilterNode[] =createFilters(new AudioContext())

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

    getCurveData(options:EQBandOptions[],size =50) {
      const finalResponse =new Float32Array(size)

      const frequencyData = new Float32Array(size).map((_,i) => valueToHz(i,size))
      const magResponse = new Float32Array(size)
      const phaseResponse = new Float32Array(size)

      options.forEach((o,i) => {
        const filter =demoFilters[i]
        if ( !filter ) return

        if ( o.Q !== undefined ) filter.Q.setValueAtTime(o.Q,0)
        if ( o.frequency !== undefined ) filter.frequency.setValueAtTime(o.frequency,0)
        if ( o.gain !== undefined ) filter.gain.setValueAtTime(o.gain,0)
        if ( o.type !== undefined ) filter.type =o.type
      })

      demoFilters.forEach(f => {
        f.getFrequencyResponse(frequencyData,magResponse,phaseResponse)
        magResponse.forEach((m,i) => finalResponse[i] += m)
      })

      return finalResponse.map(m => m -= demoFilters.length /2)
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
