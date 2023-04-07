

export function formatUnixDate(input:number) {
  const formatter =new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/London"
  })
  
  return formatter.format(input *1000)
}

