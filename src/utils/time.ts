export function formatSeconds(input: number): string {
  const seconds = Math.floor(input < 0 ? 0 : input)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`
  return `${formattedMinutes}:${formattedSeconds}`
}
