/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#121212",
        "light-purple": "#a688fa",
        "darker-purple": "#9171f8",
        "light-blue": "#5e43f3",
        "very-light-purple": "#ba9ffb",
        "input-bg": "#282828",
        "dark-purple": "#1a1625",
        "light-grey-p": "#908d96",
        "mid-purple": "#46424f",
        "darker-grey": "#3f3f3f",
      },
    },
  },
  plugins: [],
};
