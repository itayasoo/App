import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment at itayasoo.github.io/App
  // basePath: "/App",
};

export default nextConfig;
