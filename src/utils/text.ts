export function trimText(input: string, maxlength = 21) {
  if (input.length > maxlength) return input.slice(0, maxlength - 2) + "..."
  return input
}
