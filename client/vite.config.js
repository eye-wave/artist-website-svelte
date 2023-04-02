import { sveltekit } from "@sveltejs/kit/vite"
import Icons from "unplugin-icons/vite"
import svg from "@poppanator/sveltekit-svg"

/** @type {import('vite').UserConfig} */
const config = {
  assetsInclude: ["**/*.opus"],
  plugins: [
    sveltekit(),
    Icons({ compiler: "svelte" }),
    svg()
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"]
  },
  resolve: {
    alias: {
      "src": "/src",
      "$lib": "src/lib"
    }
  }
}

export default config
