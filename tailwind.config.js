/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  colors: {
    yellow: "#FFDF11",
    multiplierHistoryBlue: "#9092FA",
  },
  theme: {
    extend: {
      fontFamily: {
        VT323: ["VT323", "monospace"],
      },
    },
  },
  plugins: [],
};
