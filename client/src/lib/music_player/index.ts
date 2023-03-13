import { browser } from "$app/environment"
import { shortFetch } from "src/utils/shortFetch"
import { derived, writable } from "svelte/store"
import { createAudioEffects, type AudioEffects, type EffectChainOptions } from "./audioEffects"
import { createTrackMap, type FetchedTrack, type TrackMapEntry } from "./trackMap"

export enum PLAYER_STATE { playing, paused, idle, loading, error }
export type MusicPlayer =ReturnType<typeof createMusicPlayer>
export function createMusicPlayer() {
  let audioContext:AudioContext|undefined
  let audioElement:HTMLAudioElement|undefined
  let audioEffects:AudioEffects|undefined
  
  let audioEffectsPreset:EffectChainOptions ={
    sequence: ["waveshaper"],
    waveshaper: {
      dry: 0,
      wet: 0.7
    }
  }

  const trackMap =createTrackMap()
  let currentTrack:TrackMapEntry|undefined
  const currentTrackStore =writable<TrackMapEntry|undefined>()
  const setCurrentTrack =(track?:TrackMapEntry) => {
    currentTrack =track
    currentTrackStore.set(track)
  }


  let playerState =PLAYER_STATE.idle
  const playerStateStore =writable<PLAYER_STATE>(PLAYER_STATE.idle)
  const setPlayerState =(state:PLAYER_STATE) => {
    playerState =state
    playerStateStore.set(state)
  }



  const onError =() => {
    setPlayerState(PLAYER_STATE.error)
    setCurrentTrack()
  }

  const onTrackEnded =() => {
    setPlayerState(PLAYER_STATE.idle)
  }

  const onReady =async () => {
    if ( !audioEffects ) return
    if ( !audioElement ) return

    setPlayerState(PLAYER_STATE.playing)
    audioEffects.loadEffectChain( audioEffectsPreset )
    audioElement.play()
  }

  


  
  return {
    get isInitialized() { return audioContext !== undefined || audioElement !== undefined },
    get currentTrack() { return currentTrack },
    get state() { return playerState },
    get audioEffects() { return audioEffects },

    stores: {
      playerStateStore: derived(playerStateStore,state => state),
      currentTrackStore: derived(currentTrackStore,track => track),
      // TODO store or some other getter for current effect preset
    },

    changeEffectParam(options: Omit<EffectChainOptions,"sequence">) {
      console.log(options)

      if ( (options.speed || 0) > 0.5 ) audioEffectsPreset.speed =options.speed
      if ( options.reverb ) {
        if ( !audioEffectsPreset.reverb ) audioEffectsPreset.reverb ={}
        if ( options.reverb.dry !== undefined ) audioEffectsPreset.reverb.dry =options.reverb.dry
        if ( options.reverb.wet !== undefined ) audioEffectsPreset.reverb.wet =options.reverb.wet
      }
      if ( options.waveshaper ) {
        if ( !audioEffectsPreset.waveshaper ) audioEffectsPreset.waveshaper ={}
        if ( options.waveshaper.dry !== undefined ) audioEffectsPreset.waveshaper.dry =options.waveshaper.dry
        if ( options.waveshaper.wet !== undefined ) audioEffectsPreset.waveshaper.wet =options.waveshaper.wet
        if ( options.waveshaper.curve ) audioEffectsPreset.waveshaper.curve =options.waveshaper.curve
      }
      if ( options.eq ) {
        if ( !options.eq ) {
          audioEffectsPreset.eq =[...options.eq]
        }
      }

      audioEffects && audioEffects.changeEffectParam( options )

      return this
    },

    loadEffectChain(options: EffectChainOptions) {
      if ( !audioEffects ) return this
      
      audioEffectsPreset =options
      audioEffects.loadEffectChain(audioEffectsPreset)
      
      return this
    },

    async initialize() {
      if ( !browser ) return
      
      setPlayerState(PLAYER_STATE.loading)

      audioContext = new AudioContext()
      audioElement =new Audio()
      audioEffects =await createAudioEffects(audioContext,audioElement)

      audioElement.onerror =onError
      audioElement.onended =onTrackEnded
      audioElement.onloadeddata =onReady

      setPlayerState(PLAYER_STATE.idle)
      return this
    },

    removeSong( url:string ) {
      const song =trackMap.get( url )
      if ( !song ) return this

      trackMap.delete( url )
      URL.revokeObjectURL( song.blobUrl )
      return this
    },

    async downloadSong( songId:string ):Promise<void> {
      if ( trackMap.has(songId) ) return
      
      const songInfo =await shortFetch(`/api/song?id=${songId}`,"json") as FetchedTrack
      const blobUrl =await shortFetch(`http://localhost:3000/storage/file/${songId}`,"audioUrl") as string
      trackMap.add(songId, {...songInfo,blobUrl,id:songId})
    },

    play( id:string ) {
      if ( playerState !== PLAYER_STATE.idle ) return this
      if ( !audioElement ) return this
      
      setCurrentTrack(trackMap.get( id ))
      if ( !currentTrack ) {
        onError()
        return this
      }

      setPlayerState(PLAYER_STATE.loading)
      audioElement.src =currentTrack.blobUrl
      
      if ( audioElement.readyState === 4 ) {
        setPlayerState(PLAYER_STATE.playing)
        audioElement.play()
        return
      }

      return this
    },

    pause() {
      if ( playerState !== PLAYER_STATE.playing ) return this
      if ( !audioElement ) return this

      audioElement.pause()
      setPlayerState(PLAYER_STATE.paused)

      return this
    },

    resume() {
      if ( playerState !== PLAYER_STATE.paused ) return this
      if ( !audioElement ) return this

      audioElement.play()
      setPlayerState(PLAYER_STATE.playing)
      
      return this
    },

    

  }
}
