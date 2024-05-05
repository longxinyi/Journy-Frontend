/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    colors: {
      black: "#000000",
      white: "#ffffff",
      transparent: "transparent",
      beige: "#f8f0ca",
      green: "#196f5d",
      blue: "#141451",
      lightGreen: "#549464",
      red: "#FF0000",
    },
  },
  plugins: [],
};
