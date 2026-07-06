import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050510",
    theme_color: "#7c5cff",
    icons: [
      { src: "/brand/authorchain-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/authorchain-icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/brand/authorchain-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
