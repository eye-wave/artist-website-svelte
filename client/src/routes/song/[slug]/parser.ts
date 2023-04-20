export function parsePost(input:string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g,"&#34;")
    .replace(/\n/g,"<br>")
    .replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, "<a class=\"text-primary-400 underline\" target=\"_blank\" href=\"$2\">$1</a>")
}
