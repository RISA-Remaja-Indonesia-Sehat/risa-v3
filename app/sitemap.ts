import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    "https://risa-v2.vercel.app";

  const routes = [
    "",
    "/chapters/chapter-1",
    "/chapters/chapter-2",
    "/chapters/chapter-3",
    "/chapters/chapter-4",
    "/chapters/chapter-5",
    "/chapters/chapter-6",
    "/chapters/chapter-7",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}