export function formatSeconds(input: number): string {
  const seconds = Math.floor(input < 0 ? 0 : input)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`

  return `${formattedMinutes}:${formattedSeconds}`
}

export function formatUnixDate(input: number, short = false) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: short ? "2-digit" : "long",
    timeZone: "Europe/London",
    year: "numeric",
  })

  try {
    const formattedDate = formatter.format(input * 1000)
    return formattedDate
  } catch {
    return Infinity
  }
}
