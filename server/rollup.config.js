import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import pkg from "./package.json" assert { type: "json" }

/** @type {import('rollup').RollupOptions} */
export default ["index","filemap"].map(filename => ({
  input: `./src/${filename}.ts`,
  output: {
    name: filename,
    format: "es",
    sourcemap: true,
    file: `./dist/${filename}.js`
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
}))
