import { notFound } from "next/navigation";

import BlogPage from "@/src/app/components/blog";
import {
  defaultPermalinkPrefix,
  defaultPermalinkType,
  matchPermalink,
  permalinkFormats,
} from "@/src/utils/permalink";
import { getPostBySlug } from "@/src/lib/queries/post";
import {
  shortenText,
  stripHtml,
  decodeAndSanitizeHtml,
  objectToQueryParams,
} from "@/src/utils";
import { ResolvingMetadata, Metadata } from "next";
import { getSiteUrl } from "@/src/utils/url";
import { getData } from "@/src/utils/post";
import { generatePostDescription } from "@/src/utils/post";

interface PageProps {
  params: {
    paths?: string[];
  };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const path = params.paths?.join("/") || "";
  const firstSegment = params.paths?.[0] || "";

  const post = await getData(path, firstSegment);

  const previousImages = (await parent).openGraph?.images || [];
  if (post) {
    // Add JSON-LD script
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: generatePostDescription(post),
      author: {
        "@type": "Person",
        name: post.author?.name,
        url: `${getSiteUrl()}/author/${post.author?.username}`,
      },
      datePublished: post.published_at || post.created_at,
      image:
        post.featured_image?.url ||
        `${getSiteUrl()}/api/og?${objectToQueryParams({
          title: post.title,
          date: post.published_at || post.created_at,
        })}`,
      publisher: {
        "@type": "Organization",
        name: "Your Blog Name", // Replace with your blog name
        url: getSiteUrl(),
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${getSiteUrl()}/${path}`,
      },
      articleSection: post.category?.name,
      wordCount: post.reading_time ? post.reading_time * 200 : undefined, // Rough estimate based on reading time
    };

    return {
      title: post?.title,
      description: generatePostDescription(post),
      creator: post?.author?.name,
      authors: [
        {
          name: post?.author?.name,
          url: `${getSiteUrl()}/author/${post?.author?.username}`,
        },
      ],
      category: post?.category?.name,
      openGraph: {
        images: [
          ...previousImages,
          {
            url:
              post?.featured_image?.url ||
              `/api/og?${objectToQueryParams({
                title: post?.title,
                date: post?.published_at
                  ? post?.published_at
                  : post?.created_at,
                avatar: post?.author?.avatar,
                name: post?.author?.name,
                category: post?.category?.name,
                readingTime: post?.reading_time,
              })}`,
            width: 1200,
            height: 630,
          },
        ],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${post?.title} - ${post?.category?.name}`,
        description: `${generatePostDescription(post)}`,
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
        noimageindex: false,
        nositelinkssearchbox: false,
      },
    };
  }
  return {};
}
export default async function DynamicPage({ params }: PageProps) {
  const path = params.paths?.join("/") || "";
  const firstSegment = params.paths?.[0] || "";

  // Skip processing if this is a known Next.js file route
  // This is a safety check but should rarely be needed since
  // Next.js will prioritize file-based routes over dynamic routes
  if (path.startsWith("api") || path.startsWith("_next")) {
    return null;
  }

  const post = await getData(path, firstSegment);
  if (post) {
    return <BlogPage post={post} />;
  }

  // If no blog post is found, you have two options:
  // 1. Return 404 (this is what we're doing here)
  // 2. Fall back to a file-based page if one exists at this path
  //    (though Next.js should handle this automatically)
  return notFound();
}
