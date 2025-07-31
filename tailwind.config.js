/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff0080',
        'neon-blue': '#00ffff',
        'neon-green': '#00ff00',
        'neon-yellow': '#ffff00',
        'neon-purple': '#8000ff',
        'retro-orange': '#ff8000',
        'dark-bg': '#1a1a2e',
        'darker-bg': '#16213e',
      },
      fontFamily: {
        'comic': ['Comic Neue', 'cursive'],
        'lucky': ['Luckiest Guy', 'cursive'],
        'indie': ['Indie Flower', 'cursive'],
      },
      animation: {
        'bounce-fun': 'bounce 0.5s ease-in-out',
        'wiggle': 'wiggle 0.3s ease-in-out',
        'pop': 'pop 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
