import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "three-spritetext", "react-force-graph-3d"],
};

export default nextConfig;
