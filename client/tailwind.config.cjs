/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  future: {
    disableColorOpacityUtilitiesByDefault: true,
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    relativeContentPathsByDefault: true
  },
  theme: {
    extend: {
      colors: {
        "primary": {
          "50": "#e9fbfa",
          "100": "#d2f8f5",
          "200": "#a6f0ea",
          "300": "#79e9e0",
          "400": "#4de1d5",
          "500": "#20dacb",
          "600": "#1aaea2",
          "700": "#13837a",
          "800": "#0d5751",
          "900": "#062c29"
        },
        dark: {
          "blue": {
            "50": "#e7e8eb",
          "100": "#cfd2d6",
          "200": "#9fa4ad",
          "300": "#6f7784",
          "400": "#3f495b",
          "500": "#0f1c32",
          "600": "#0c1628",
          "700": "#09111e",
          "800": "#060b14",
          "900": "#03060a"
          }
        },
        catppuccin: {
          rosewater: "#f4dbd6",
          flamingo: "#f0c6c6",
          pink: "#f5bde6",
          mauve: "#c6a0f6",
          red: "#ed8796",
          maroon: "#ee99a0",
          peach: "#f5a97f",
          yellow: "#eed49f",
          green: "#a6da95",
          teal: "#8bd5ca",
          sky: "#91d7e3",
          sapphire: "#7dc4e4",
          blue: "#8aadf4",
          lavender: "#b7bdf8",
        }
      },
      fontFamily: {
        "round": ["Varela Round", "sans-serif"],
        "sans": ["Rubik", "sans-serif"],
        "serif": ["Playfair Display", "serif"],
      },
      screens: {
        "xs": "300px",
        "tall": {
          "raw": "(min-height: 125px)"
        },
      },
    }
  },
}