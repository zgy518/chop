import type { NextConfig } from "next";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig: NextConfig = {
  // GitHub Pages needs static export + /chop subdirectory
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/chop" : "",
  assetPrefix: isGitHubPages ? "/chop" : "",
  images: {
    unoptimized: true,
  },

  // COOP/COEP headers for SharedArrayBuffer (FFmpeg.wasm multithreading)
  // GitHub Pages does NOT support custom headers — single-thread fallback
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;
