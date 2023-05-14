export type T_CUSTOM_NODE_NAME = (typeof CUSTOM_NODE_NAME)[keyof typeof CUSTOM_NODE_NAME]
export const CUSTOM_NODE_NAME = {
  REVERB: 1,
  WAVESHAPER: 2,
}

export type T_PRESET_NAMES = (typeof PRESET_NAMES)[keyof typeof PRESET_NAMES]
export const PRESET_NAMES = {
  NORMAL: 0,
  SAD: 1,
  ANGRY: 2,
  HAPPY: 3,
}

export type T_WAVESHAPER_CURVE_TYPE = (typeof WAVESHAPER_CURVE_TYPE)[keyof typeof WAVESHAPER_CURVE_TYPE]
export const WAVESHAPER_CURVE_TYPE = {
  SOFT_CLIP: 1,
  HARD_CLIP: 2,
  LINEAR_FOLD: 3,
}

export type T_PLAYER_STATE = (typeof PLAYER_STATE)[keyof typeof PLAYER_STATE]
export const PLAYER_STATE = {
  PLAYING: 1,
  PAUSED: 2,
  IDLE: 3,
  LOADING: 4,
  ERROR: 5,
}

export type T_QUEUE_STATE = Omit<(typeof QUEUE_STATE)[keyof typeof QUEUE_STATE], "next">
export const QUEUE_STATE = {
  LOOPALL: 1,
  LOOPONE: 2,
  LOOPOFF: 3,
  AUTOPLAYOFF: 4,
}
export const QUEUE_STATE_NAMES = new Map<T_QUEUE_STATE, string>([
  [QUEUE_STATE.LOOPALL, "Loop all tracks"],
  [QUEUE_STATE.LOOPONE, "Loop current track"],
  [QUEUE_STATE.LOOPOFF, "Stop at the end"],
  [QUEUE_STATE.AUTOPLAYOFF, "No autoplay"],
])
