import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships WASM + worker files that must NOT be bundled by webpack.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
