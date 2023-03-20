import { browser } from "$app/environment"
import { derived, writable } from "svelte/store"
import { createAudioEffects, type AudioEffects, type EffectChainOptions } from "./audioEffects"
import { createSongQueue, type SongMetadata } from "./queue"

export enum PLAYER_STATE { playing, paused, idle, loading, error }
export enum QUEUE_STATE { loopall, loopone, loopoff, autoplayoff }

type CurrentTrack ={ duration:number } & SongMetadata

export class MusicPlayer {
  static instance: MusicPlayer
  private constructor() {}
  static getInstance(): MusicPlayer {
    if ( !MusicPlayer.instance ) {
      MusicPlayer.instance =new MusicPlayer()
    }

    return MusicPlayer.instance
  }

  // ACE -> Audio Context Elements


  private _audioContext:AudioContext|undefined
  private _audioElement:HTMLAudioElement|undefined
  private _audioEffects:AudioEffects|undefined
  private audioEffectsPreset:EffectChainOptions ={}
  private timeStore =writable<number>(-1)

  get isInitialized() { return this._audioContext !== undefined || this._audioElement !== undefined }
  get audioEffects() { return this._audioEffects }
  get currentPreset() { return this.audioEffectsPreset }

  async initialize() {
    if ( !browser ) return
    
    this.setPlayerState(PLAYER_STATE.loading)

    this._audioContext = new AudioContext()
    this._audioElement =new Audio()
    this._audioEffects =createAudioEffects(this._audioContext,this._audioElement)

    // AEE -> Audio Element Events

    this._audioElement.onerror =() => {
      this.setPlayerState(PLAYER_STATE.error)
      this.currentTrackStore.set(null)
    }
  
    this._audioElement.onended =() => {
      this.setPlayerState(PLAYER_STATE.idle)
     
      if ( this.queue.isCurrentLast && this.queueState === QUEUE_STATE.loopoff ) return
      if ( this._queueState === QUEUE_STATE.autoplayoff ) return
      
      if ( this.queueState === QUEUE_STATE.loopone ) return this.replay() 
      
      const nextId =this.queue.next()
      if ( !nextId ) return console.warn("Couldn't find next track")

      this.play(nextId)
    }

    this._audioElement.ontimeupdate =() => {
      const time =this._audioElement?.currentTime
      this.timeStore.set(time === undefined ? -1 : time)
    }
  
    this._audioElement.onloadeddata =async () => {
      if ( !this._audioEffects ) return
      if ( !this._audioElement ) return
  
      this.setPlayerState(PLAYER_STATE.playing)
      this._audioEffects.loadEffectChain( this.audioEffectsPreset )
      this.currentTrackStore.update(meta => {
        if ( !meta ) return null
        return { ...meta, duration: this._audioElement?.duration || -1 }
      })
      this._audioElement.play()
    }

    // AEE -> Audio Element Events


    this.setPlayerState(PLAYER_STATE.idle)
    return this
  }


  public changeEffectParam(options: Omit<EffectChainOptions,"sequence">) {
    if ( (options.speed || 0) > 0.5 ) this.audioEffectsPreset.speed =options.speed
    if ( options.reverb ) {
      if ( !this.audioEffectsPreset.reverb ) this.audioEffectsPreset.reverb ={}
      if ( options.reverb.dry !== undefined ) this.audioEffectsPreset.reverb.dry =options.reverb.dry
      if ( options.reverb.wet !== undefined ) this.audioEffectsPreset.reverb.wet =options.reverb.wet
    }
    if ( options.waveshaper ) {
      if ( !this.audioEffectsPreset.waveshaper ) this.audioEffectsPreset.waveshaper ={}
      if ( options.waveshaper.dry !== undefined ) this.audioEffectsPreset.waveshaper.dry =options.waveshaper.dry
      if ( options.waveshaper.wet !== undefined ) this.audioEffectsPreset.waveshaper.wet =options.waveshaper.wet
      if ( options.waveshaper.curve ) this.audioEffectsPreset.waveshaper.curve =options.waveshaper.curve
    }
    if ( options.eq ) {
      this.audioEffectsPreset.eq =[...options.eq]
    }

    this._audioEffects && this._audioEffects.changeEffectParam( options )

    return this
  }

  public loadEffectChain(options: EffectChainOptions) {
    if ( !this._audioEffects ) return this
    
    this.audioEffectsPreset =options
    this._audioEffects.loadEffectChain(this.audioEffectsPreset)
    
    return this
  }
  


  // Q -> Queue


  private readonly queue =createSongQueue()
  private readonly currentTrackStore =writable<CurrentTrack|null>(null)

  private _queueState =QUEUE_STATE.autoplayoff
  private readonly queueStateStore =writable<QUEUE_STATE>(this._queueState)
  private setQueueState(state:QUEUE_STATE) {
    this._queueState =state
    this.queueStateStore.set(state)
  }

  get queueState() { return this._queueState }
  set queueState(state:QUEUE_STATE) { this.setQueueState(state) }

  public loadQueue(input:string[]) { this.queue.loadQueue(input) }
  private playRandom() {
    const songId =this.queue.random()
    if ( !songId ) return console.warn("Couldn't find song with id: " + songId)

    this.play(songId)
  }

  public playNext() {
    if ( this.shuffleOn ) this.playRandom()
    
    const songId =this.queue.next()
    if ( !songId ) return console.warn("Couldn't find song with id: " + songId)

    this.play(songId)
  }

  public playPrev() {
    if ( this.shuffleOn ) this.playRandom()
    
    const songId =this.queue.prev()
    if ( !songId ) return console.warn("Couldn't find song with id: " + songId)

    this.play(songId)
  }


  // PS -> Player State


  private playerState =PLAYER_STATE.idle
  private readonly playerStateStore =writable<PLAYER_STATE>(PLAYER_STATE.idle)
  private setPlayerState (state:PLAYER_STATE) {
    this.playerState =state
    this.playerStateStore.set(state)
  }

  
  // S2 -> Shuffle State


  private _shuffleOn =false
  private readonly shuffleOnStore =writable<boolean>(false)
  private setShuffleOn (state:boolean) {
    this._shuffleOn =state
    this.shuffleOnStore.set(state)
  }

  get shuffleOn() { return this._shuffleOn }
  set shuffleOn(state:boolean) { this.setShuffleOn(state) }


  // SOS -> Svelte Only Stores
  

  get stores () {
    return {
      playerStateStore: derived(this.playerStateStore,state => state),
      queueStateStore: derived(this.queueStateStore,state => state),
      shuffleOnStore: derived(this.shuffleOnStore,shuffle => shuffle),
      currentTrackStore: derived(this.currentTrackStore,track => track),
      timeStore: derived(this.timeStore,time => time)
    }
  }


  // MPC -> Music Player Controls

  public async play( songId:string ) {
    if ( !this._audioElement ) return this
    
    this.setPlayerState(PLAYER_STATE.loading)

    const id =await this.queue.play(songId)
    if ( !id ) return this
    
    const metadata =this.queue.getSongMetadata(songId)!
    // TODO remove ! and add error handling

    this.currentTrackStore.set({duration:0,...metadata})
    this._audioElement.src =id
    
    return this
  }

  public replay() {
    if ( !this._audioElement ) return this
    this._audioElement.play()
  }


  public pause() {
    if ( this.playerState !== PLAYER_STATE.playing ) return this
    if ( !this._audioElement ) return this

    this._audioElement.pause()
    this.setPlayerState(PLAYER_STATE.paused)

    return this
  }

  public resume() {
    if ( this.playerState !== PLAYER_STATE.paused ) return this
    if ( !this._audioElement ) return this

    this._audioElement.play()
    this.setPlayerState(PLAYER_STATE.playing)
    
    return this
  }

}
