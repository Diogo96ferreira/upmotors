import type { MetadataRoute } from "next";
import { company } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/backoffice", "/auth"],
    },
    sitemap: `${company.siteUrl}/sitemap.xml`,
    host: company.siteUrl,
  };
}
