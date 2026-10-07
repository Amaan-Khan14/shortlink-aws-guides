import type { NextConfig } from "next";

// Static export: the site is plain HTML/CSS/JS and can be hosted anywhere
// (S3, GitHub Pages, Vercel, Netlify). Set NEXT_PUBLIC_BASE_PATH when it is
// served from a sub-path, e.g. https://user.github.io/shortlink-aws-guides.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
