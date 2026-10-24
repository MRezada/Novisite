import type { NextConfig } from "next";

const staticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(staticPreview ? {
    output: "export",
    trailingSlash: true,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;
