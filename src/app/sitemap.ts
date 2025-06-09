import type { MetadataRoute } from "next";
import { getSiteUrl } from "../utils/url";
import { getPostsForSitemap } from "../lib/queries/posts";
import { differenceInDays } from "date-fns";
import { generatePostUrl } from "../utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostsForSitemap();
  const postsUrls = posts.data.map((post) => ({
    url: `${generatePostUrl(post as any)}`,
    lastModified: new Date(post.created_at ?? new Date()),
    changeFrequency:
      differenceInDays(new Date(post.created_at ?? new Date()), new Date()) > 30
        ? ("weekly" as const)
        : ("monthly" as const),
    priority:
      differenceInDays(new Date(post.created_at ?? new Date()), new Date()) > 30
        ? 0.8
        : 0.5,
    image: post.featured_image?.url
      ? {
          url: post.featured_image.url,
          alt: post.featured_image.alt_text,
        }
      : undefined,
  }));

  return [
    {
      url: getSiteUrl(),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${getSiteUrl()}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${getSiteUrl()}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${getSiteUrl()}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    ...postsUrls,
  ];
}
