import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "node:path";

// Next.js caches the first loadEnvConfig(appDir) call; without forceReload,
// loading the monorepo root .env is silently ignored.
loadEnvConfig(path.join(__dirname, "../.."), undefined, undefined, true);

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: [
    "@ssu/api",
    "@ssu/config",
    "@ssu/queries",
    "@ssu/schema",
    "@ssu/types",
    "@ssu/ui",
    "@ssu/utils",
  ],
  // Required for Zoom Component View video / screen-share rendering (SharedArrayBuffer).
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
};

export default nextConfig;
