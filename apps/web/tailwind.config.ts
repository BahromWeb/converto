import type { Config } from "tailwindcss";
import sharedConfig from "@converto/tailwind-config";

const config: Config = {
  ...sharedConfig,
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    // Pick up any class strings used inside @converto/ui as well.
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
