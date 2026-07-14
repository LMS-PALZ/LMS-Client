import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ssu/api",
    "@ssu/queries",
    "@ssu/schema",
    "@ssu/types",
    "@ssu/ui",
    "@ssu/utils",
  ],
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
