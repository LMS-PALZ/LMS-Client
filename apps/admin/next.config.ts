import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "node:path";

loadEnvConfig(path.join(__dirname, "../.."), undefined, undefined, true);

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ssu/api",
    "@ssu/config",
    "@ssu/queries",
    "@ssu/schema",
    "@ssu/types",
    "@ssu/ui",
    "@ssu/utils",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/createAsignment",
        destination: "/createassignment",
        permanent: true,
      },
      {
        source: "/createAsignment/:path*",
        destination: "/createassignment/:path*",
        permanent: true,
      },
      {
        source: "/createasignment",
        destination: "/createassignment",
        permanent: true,
      },
      {
        source: "/createasignment/:path*",
        destination: "/createassignment/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
