import type { NextConfig } from "next";

const isUnified = process.env.NEXT_PUBLIC_PORTAL_MODE === "unified";

const nextConfig: NextConfig = {
  ...(isUnified ? {} : { basePath: "/admin" }),
  transpilePackages: [
    "@ssu/api",
    "@ssu/queries",
    "@ssu/schema",
    "@ssu/types",
    "@ssu/ui",
    "@ssu/utils",
  ],
};

export default nextConfig;
