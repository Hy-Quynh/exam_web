/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'yellow': '#F9ED32',
      'black': '#000000',
      'darkYellow': '#D8BD32',
      'white': '#ffffff',
      'primary': '#4096ff',
      'adminMenuBg': '#001528',
      'purple': '#626CB3',
      'yellowDark': '#FFB93C'
    },
  },
  plugins: [],
}