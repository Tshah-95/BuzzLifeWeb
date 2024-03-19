import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ccccff",
        secondary: "#E32565",
        tertiary: "#3B99FB",
        lightblue: "#33DDFF",
        lightblack: "#121212",
      },
      flex: {
        "2": "2 2 0%",
        "3": "3 3 0%",
        "4": "4 4 0%",
        "5": "5 5 0%",
      },
    },
  },
  plugins: [],
};
export default config;
