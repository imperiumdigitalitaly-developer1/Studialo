import type { MetadataRoute } from "next";
import { getMaterie } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const materie = getMaterie();
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...["chi-sono", "privacy", "cookie", "note-legali"].map((slug) => ({
      url: `${site.url}/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
    ...materie.flatMap((m) => [
      { url: `${site.url}/${m.slug}`, changeFrequency: "weekly" as const, priority: 0.8 },
      ...m.chapters.map((c) => ({
        url: `${site.url}/${m.slug}/${c.slug}`,
        ...(c.updated ? { lastModified: c.updated } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ]),
  ];
}
