export function sanatizeHtmlString(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/`/g, "&#96;;")
}

export function parsePost(input: string) {
  return sanatizeHtmlString(input)
    .replace(/\n/g, "<br>")
    .replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, '<a class="text-primary-400 underline" target="_blank" href="$2">$1</a>')
}

export function getRawTextFromPost(input: string) {
  return sanatizeHtmlString(input)
    .replace(/\n/g, " ")
    .replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, "$1")
}
