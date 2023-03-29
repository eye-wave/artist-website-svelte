import type { MusicPlayer } from "src/lib/music_player"
import { writable } from "svelte/store"

export const isMusicPlayerInitialized =writable<undefined|MusicPlayer>(undefined)
