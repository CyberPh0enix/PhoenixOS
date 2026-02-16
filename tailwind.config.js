/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "terminal-green": "#0f0",
        "terminal-black": "#0c0c0c",
      },
      fontFamily: {
        mono: ['"Courier New"', "monospace"], // Hacker vibes
      },
    },
  },
  plugins: [],
};
