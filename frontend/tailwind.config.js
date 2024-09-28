/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js, ts, jsx, tsx}",
    "./src/**/*.tsx",
    "./src/**/*.jsx",
    "./src/**/*.js",
  ],
  theme: {
    extend: {},
    container: {
      padding: {
        md: "10rem" ,
      },
    },
  },
  plugins: [],
}

