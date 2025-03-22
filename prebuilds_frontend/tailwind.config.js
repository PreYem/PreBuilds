/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 15s linear infinite",
        slideDown: 'slideDown 0.5s ease-out forwards',
        fadeOut: 'fadeOut 1s ease-in forwards',
      },
      fontFamily: {
        mono: ["Roboto Mono", "monospace"],
      },

      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
