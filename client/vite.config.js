import { sveltekit } from "@sveltejs/kit/vite"
import Icons from "unplugin-icons/vite"

/** @type {import('vite').UserConfig} */
const config = {
  assetsInclude: ["**/*.opus"],
  plugins: [sveltekit(),Icons({ compiler: "svelte" })],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"]
  },
  resolve: {
    alias: {
      "src": "/src"
    }
  }
}

export default config
