import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile workspace packages — required for `@converto/*` to work in Next.
  transpilePackages: ["@converto/ui", "@converto/utils", "@converto/types", "@converto/data"],
  // Emit a self-contained Node server at .next/standalone for Docker.
  // outputFileTracingRoot points at the monorepo root so Turbo's workspace
  // packages get traced into the bundle instead of being missed as externals.
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
