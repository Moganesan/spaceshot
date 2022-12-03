/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  colors: {
    yellow: "#FFDF11",
    multiplierHistoryBlue: "#9092FA",
    backgroundColor: "#1B1F22",
  },
  theme: {
    screens: {
      smb: "320px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        VT323: ["VT323", "monospace"],
      },
    },
  },
  plugins: [],
};
