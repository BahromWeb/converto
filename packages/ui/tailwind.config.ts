import type { Config } from "tailwindcss";
import sharedConfig from "@converto/tailwind-config";

/**
 * Tailwind config used only when running `shadcn` CLI commands against this
 * package. The actual build configs live in each consuming app.
 */
const config: Config = {
  ...sharedConfig,
  content: ["./src/**/*.{ts,tsx}"],
};

export default config;
