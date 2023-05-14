export function formatUnixDate(input: number, short = false) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: short ? "2-digit" : "long",
    day: "numeric",
    timeZone: "Europe/London",
  })

  try {
    const formattedDate = formatter.format(input * 1000)
    return formattedDate
  } catch {
    return Infinity
  }
}
