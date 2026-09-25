import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` emits HTML/CSS/JS to /out for Cloudflare Pages.
  output: "export",
  // The default image optimizer needs a server, which a static export doesn't have.
  images: { unoptimized: true },
};

export default nextConfig;
