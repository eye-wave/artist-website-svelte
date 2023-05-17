const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    fontFamily: {
      mono: ["ui-monospace"],
      title: ["Lilita One", "cursive"],
      sans: ["Montserrat", "sans-serif"],
    },
    extend: {
      colors: {
        primary: colors.violet,
        gray: colors.zinc,
      },
    },
  },
}
