import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore", "/book/", "/api/assets/"],
      // Private, transactional, and authenticated areas stay out of the index.
      disallow: [
        "/dashboard",
        "/reader/library",
        "/reader/books/",
        "/checkout/",
        "/login",
        "/share/",
        "/r/",
        "/api/reader/",
        "/api/webhooks/",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
