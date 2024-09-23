/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#1D4ED8',  // Azul primario
        secondary: '#ef4141',  // Púrpura secundario
      },
      boxShadow: {
        'custom-light': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 2px 8px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};
