import type { Config } from "tailwindcss";
import base from "@ssu/config/tailwind";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../student/src/**/*.{ts,tsx}",
    "../admin/src/**/*.{ts,tsx}",
    "../tutor/src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      ...base.theme?.extend,
    },
  },
  plugins: [],
};

export default config;
