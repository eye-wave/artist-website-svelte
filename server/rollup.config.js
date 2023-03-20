import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import pkg from "./package.json" assert { type: "json" }

/** @type {import('rollup').RollupOptions} */
export default {
  input: `./src/index.ts`,
  output: {
    format: "es",
    sourcemap: true,
    file: `./dist/index.js`
  },
  external: ["dotenv/config",...Object.keys(pkg?.dependencies || {})],
  plugins: [
    terser({
      compress: true,
      mangle: true
    }),
    typescript(),
    resolve({ browser: false })
  ]
}
