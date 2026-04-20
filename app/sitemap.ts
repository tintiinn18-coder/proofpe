import type { MetadataRoute } from "next";
import { seedStartups } from "@/lib/seed";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/submit",
    "/leaderboard",
    "/pricing",
    "/about",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/contact"
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7
  }));

  const profiles = seedStartups.map((startup) => ({
    url: `${siteUrl}/startup/${startup.slug}`,
    lastModified: new Date(startup.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  return [...routes, ...profiles];
}
