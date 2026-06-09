/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#EAF7F3",
        sand: "#D4ECE6",
        maroon: {
          DEFAULT: "#3E7CA5",
          dark: "#2E6189",
        },
        gold: {
          DEFAULT: "#F39B76",
          light: "#FBC4A6",
        },
        ink: "#2C3E47",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(46, 97, 137, 0.25)",
      },
    },
  },
  plugins: [],
};
