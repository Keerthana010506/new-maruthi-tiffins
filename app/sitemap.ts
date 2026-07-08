import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://new-maruthi-tiffins.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: "https://new-maruthi-tiffins.vercel.app/profile",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: "https://new-maruthi-tiffins.vercel.app/orders",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }
  ];
}