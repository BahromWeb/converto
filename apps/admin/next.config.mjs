import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@converto/ui",
    "@converto/utils",
    "@converto/types",
    "@converto/data",
  ],
  // Self-contained Node server at .next/standalone for the Docker image.
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
