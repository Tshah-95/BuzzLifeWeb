import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#ccccff",
      secondary: "#E32565",
      tertiary: "#3B99FB",
      lightBlue: "#33DDFF",
      lightBlack: "#121212",
    },
  },
  plugins: [],
};
export default config;
