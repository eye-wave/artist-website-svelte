import svg from "@poppanator/sveltekit-svg"
import { sveltekit } from "@sveltejs/kit/vite"
import Icons from "unplugin-icons/vite"

/** @type {import('vite').UserConfig} */
const config = {
  assetsInclude: ["**/*.opus"],
  plugins: [sveltekit(), Icons({ compiler: "svelte" }), svg()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
  resolve: {
    alias: {
      "~": "/src",
      $api: "/src/routes/api",
      $lib: "/src/lib",
    },
  },
}

export default config
