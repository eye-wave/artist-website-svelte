import { browser } from "$app/environment"
import { derived, writable } from "svelte/store"
import { createAudioEffects, type AudioEffects } from "./audioEffects"
import { PLAYER_STATE, QUEUE_STATE, type T_PLAYER_STATE, type T_QUEUE_STATE } from "./enums"
import { createSongQueue, type SongMetadata } from "./queue"

export type CurrentTrack = { duration: number } & SongMetadata

export class MusicPlayer {
  static instance: MusicPlayer
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  static getInstance(): MusicPlayer {
    if (!MusicPlayer.instance) {
      MusicPlayer.instance = new MusicPlayer()
    }

    return MusicPlayer.instance
  }

  // ACE -> Audio Context Elements

  private _audioContext: AudioContext | undefined
  private _audioElement: HTMLAudioElement | undefined
  private _audioEffects: AudioEffects | undefined
  private _mediaSession: MediaSession | undefined
  private timeStore = writable<number>(-1)
  private isInitializedStore = writable(false)
  private volumeStore = writable(1)

  get isInitialized() {
    return this._audioContext !== undefined || this._audioElement !== undefined
  }
  get audioEffects() {
    return this._audioEffects
  }

  async initialize() {
    if (!browser) return

    this.setPlayerState(PLAYER_STATE.LOADING)
    this.isInitializedStore.set(true)

    this._audioContext = new AudioContext()
    this._audioElement = new Audio()
    this._audioEffects = createAudioEffects(this._audioContext, this._audioElement)
    this._mediaSession = window.navigator.mediaSession

    this._mediaSession.setActionHandler("play", () => this.resume())
    this._mediaSession.setActionHandler("pause", () => this.pause())
    this._mediaSession.setActionHandler("nexttrack", () => this.playNext())
    this._mediaSession.setActionHandler("previoustrack", () => this.playPrev())

    this._audioElement.onerror = () => {
      this.setPlayerState(PLAYER_STATE.ERROR)
      this.currentTrackStore.set(null)
    }

    this._audioElement.onended = () => {
      this.setPlayerState(PLAYER_STATE.IDLE)
      this.timeStore.set(0)

      if (this.queue.isCurrentLast && this.queueState === QUEUE_STATE.LOOPOFF) return
      if (this._queueState === QUEUE_STATE.AUTOPLAYOFF) return

      if (this.queueState === QUEUE_STATE.LOOPONE) return this.replay()

      const nextId = this.shuffleOn ? this.queue.random() : this.queue.next()
      if (!nextId) return console.warn("Couldn't find next track")

      this.play(nextId)
    }

    this._audioElement.ontimeupdate = () => {
      const time = this._audioElement?.currentTime
      this.timeStore.set(time === undefined ? -1 : time)
    }

    this._audioElement.onloadeddata = async () => {
      if (!this._audioEffects) return
      if (!this._audioElement) return

      this.setPlayerState(PLAYER_STATE.PLAYING)
      this._audioEffects.loadEffectChain()
      this.currentTrackStore.update(meta => {
        if (!meta) return null
        return { ...meta, duration: this._audioElement?.duration || -1 }
      })
      this._audioElement.play()
    }

    // AEE -> Audio Element Events

    this.setPlayerState(PLAYER_STATE.IDLE)
    return this
  }

  // Q -> Queue

  private readonly queue = createSongQueue()
  private readonly currentTrackStore = writable<CurrentTrack | null>(null)

  private _queueState: T_QUEUE_STATE = QUEUE_STATE.AUTOPLAYOFF
  private readonly queueStateStore = writable<T_QUEUE_STATE>(this._queueState)
  private setQueueState(state: T_QUEUE_STATE) {
    this._queueState = state
    this.queueStateStore.set(state)
  }

  get queueLength() {
    return this.queue.length
  }
  get queueState() {
    return this._queueState
  }
  set queueState(state: T_QUEUE_STATE) {
    this.setQueueState(state)
  }

  public loadQueue(input: string[]) {
    this.queue.loadQueue(input)
  }
  private playRandom() {
    const songId = this.queue.random()
    if (!songId) return console.warn("Couldn't find song with id: " + songId)

    this.play(songId)
  }

  public playNext() {
    if (this.shuffleOn) {
      this.playRandom()
      return this
    }

    const songId = this.queue.next()
    if (!songId) return console.warn("Couldn't find song with id: " + songId)

    this.play(songId)
  }

  public playPrev() {
    if (this.shuffleOn) {
      this.playRandom()
      return this
    }

    const songId = this.queue.prev()
    if (!songId) return console.warn("Couldn't find song with id: " + songId)

    this.play(songId)
  }

  // PS -> Player State

  private playerState = PLAYER_STATE.IDLE
  private readonly playerStateStore = writable<T_PLAYER_STATE>(PLAYER_STATE.IDLE)
  private setPlayerState(state: T_PLAYER_STATE) {
    this.playerState = state
    this.playerStateStore.set(state)
  }

  // S2 -> Shuffle State

  private _shuffleOn = false
  private readonly shuffleOnStore = writable<boolean>(false)
  private setShuffleOn(state: boolean) {
    this._shuffleOn = state
    this.shuffleOnStore.set(state)
  }

  get shuffleOn() {
    return this._shuffleOn
  }
  set shuffleOn(state: boolean) {
    this.setShuffleOn(state)
  }

  // SOS -> Svelte Only Stores

  get stores() {
    return {
      isInitializedStore: derived(this.isInitializedStore, init => init),
      playerStateStore: derived(this.playerStateStore, state => state),
      queueStateStore: derived(this.queueStateStore, state => state),
      shuffleOnStore: derived(this.shuffleOnStore, shuffle => shuffle),
      currentTrackStore: derived(this.currentTrackStore, track => track),
      timeStore: derived(this.timeStore, time => time),
      volumeStore: derived(this.volumeStore, e => e),
    }
  }

  // MPC -> Music Player Controls

  public async play(songId: string) {
    if (!this._audioElement) return this

    this.setPlayerState(PLAYER_STATE.LOADING)

    const song = await this.queue.play(songId)
    if (!song) return this

    this.currentTrackStore.set({ duration: 0, ...song.metadata })
    this._audioElement.src = song.url

    if (!this._mediaSession) return this
    this._mediaSession.metadata = new MediaMetadata({
      title: song.metadata.metadata.title,
      album: "",
      artist: "_eyewave",
      artwork: [96, 128, 192, 256, 384, 512].map(n => ({
        src: `/api/storage/file/${song.metadata.metadata.imageId}?width=${n}&height=${n}`,
        sizes: `${n}x${n}`,
        type: "image/webp",
      })),
    })

    return this
  }

  public setVolume(input: number) {
    if (!this._audioElement) return
    this._audioElement.volume = input
    this.volumeStore.set(input)
  }

  public replay() {
    if (!this._audioElement) return this
    this.setPlayerState(PLAYER_STATE.PLAYING)
    this._audioElement.play()
  }

  public skipTo(time: number) {
    if (!this._audioElement) return
    this._audioElement.currentTime = time
  }

  public pause() {
    if (this.playerState !== PLAYER_STATE.PLAYING) return this
    if (!this._audioElement) return this

    this._audioElement.pause()
    this.setPlayerState(PLAYER_STATE.PAUSED)

    return this
  }

  public resume() {
    if (this.playerState !== PLAYER_STATE.PAUSED) return this
    if (!this._audioElement) return this

    this._audioElement.play()
    this.setPlayerState(PLAYER_STATE.PLAYING)

    return this
  }
}

export const musicPlayer = MusicPlayer.getInstance()
