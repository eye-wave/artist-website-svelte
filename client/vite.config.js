import { sveltekit } from "@sveltejs/kit/vite"

/** @type {import('vite').UserConfig} */
const config = {
  assetsInclude: ["**/*.opus"],
  plugins: [sveltekit()],
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
