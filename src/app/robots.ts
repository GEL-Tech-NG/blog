import type { MetadataRoute } from "next";
import { getSiteUrl } from "../utils/url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/preview/"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
