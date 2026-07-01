import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Manuscript uploads go through Server Actions; the default body limit is
    // 1MB, too small for PDF/EPUB. Raise it for book files.
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
