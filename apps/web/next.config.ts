import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_PORTAL_MODE: "unified",
  },
  transpilePackages: [
    "@ssu/api",
    "@ssu/config",
    "@ssu/queries",
    "@ssu/schema",
    "@ssu/types",
    "@ssu/ui",
    "@ssu/utils",
  ],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
