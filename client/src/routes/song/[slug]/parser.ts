export function parsePost(input:string) {
  return input
    .replace(/\n/g,"<br>")
    .replace(/\[(.*?)\]\((.*?)\)/g, "<a class=\"text-primary-400 underline\" target=\"_blank\" href=\"$2\">$1</a>")
}
