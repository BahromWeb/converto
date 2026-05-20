/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile workspace packages — required for `@converto/*` to work in Next.
  transpilePackages: ["@converto/ui", "@converto/utils", "@converto/types", "@converto/data"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
