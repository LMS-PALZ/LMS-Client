import type { Config } from "tailwindcss";
import base from "@ssu/config/tailwind";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      ...base.theme?.extend,
    },
  },
};

export default config;
