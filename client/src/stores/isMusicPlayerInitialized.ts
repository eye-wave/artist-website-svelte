import { writable } from "svelte/store"
import type { MusicPlayer } from "$lib/music_player"

export const isMusicPlayerInitialized =writable<undefined|MusicPlayer>(undefined)
