const LOG_MIN = Math.log10(20)
const LOG_MAX = Math.log10(20000)

export const valueToHz = (input: number, max = 100, min = 0) =>
  10 ** (((input - min) / (max - min)) * (LOG_MAX - LOG_MIN) + LOG_MIN)
export const hzToValue = (hz: number, max = 100, min = 0) =>
  ((Math.log10(hz) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (max - min) + min

export const valueToGain = (value: number, max = 100, min = 0) => (value - min) / ((max - min) / 2) - 1
export const gainToValue = (input: number, max = 100, min = 0) => ((input + 1) * (max - min)) / 2 + min
