import type { MetadataRoute } from "next";
import { getCars } from "@/lib/data";
import { company } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await getCars();
  const baseUrl = company.siteUrl.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/stock`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/importacao`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sell`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const carRoutes: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${baseUrl}/stock/${car.slug}`,
    changeFrequency: "weekly",
    priority: car.featured ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...carRoutes];
}
