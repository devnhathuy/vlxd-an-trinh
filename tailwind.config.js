/** @type {import('tailwindcss').Config} */ export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#0F4C97",
          600: "#0B3D7A",
          700: "#082F5F",
        },
        accent: "#F59E0B",
      },
      boxShadow: { soft: "0 20px 50px rgba(15,76,151,.10)" },
      fontFamily: { sans: ["Be Vietnam Pro", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
