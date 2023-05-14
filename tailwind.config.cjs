/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  future: {
    disableColorOpacityUtilitiesByDefault: true,
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    relativeContentPathsByDefault: true,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#effdfd",
          100: "#d2f7f9",
          200: "#aaf0f4",
          300: "#76e4ec",
          400: "#39d0dd",
          500: "#14b4c6",
          600: "#0892a2",
          700: "#097684",
          800: "#0b5e6b",
          900: "#0d4f5a",
        },
      },
      fontFamily: {
        title: ["Lilita One", "cursive"],
        sans: ["Montserrat", "sans-serif"],
      },
      screens: {
        xs: "300px",
        tall: {
          raw: "(min-height: 125px)",
        },
      },
    },
  },
}
