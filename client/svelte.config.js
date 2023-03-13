import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/kit/vite"
import path from "path"

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      "src": path.resolve("./src"),
      "$lib": path.resolve("./src/lib"),
      "$util": path.resolve("./src/utils"),
    }
  },
}