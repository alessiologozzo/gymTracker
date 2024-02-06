/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
        screens: {
            '3xl': '2048px'
        },
        container: {
            padding: '2rem',
            center: true
        }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "garden", "retro", "dark", "dracula", "coffee"]
  }
}

