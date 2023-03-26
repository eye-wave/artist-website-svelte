import type { Handle } from "@sveltejs/kit"
import { minify } from "html-minifier"

export const handle = (async ({ event, resolve }) => {
  const lang ="en"

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => minify(html,{
      collapseWhitespace: true,
      minifyCSS: {},
      minifyJS: {
        compress: {
          dead_code: false
        }
      },
      minifyURLs: {
        ignore_www: true,
      }
    }).replace(/<noscript[^>]+>/,"<noscript>"),
  })
 
  return response
}) as Handle
