/** @type {import('tailwindcss').Config} */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  theme: {
    extend: {
      colors: {
        "blue": "#2563EB",
        "green": "#166534",
        "light-green": "#DCFCE7",
        "dark-red": "#991B1B",
        "dark-white": "#F3F4F6",
        "off-white": "#4B5563",
      },
      borderColor: {
        basic: "E5E7EB",
      },
    },
  },
};
