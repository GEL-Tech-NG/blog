import PostPage from "@/src/app/components/pages/PostPage";

import { PostSelect } from "@/src/types";
import {
  objectToQueryParams,
  shortenText,
  stripHtml,
  decodeAndSanitizeHtml,
} from "@/src/utils";
import { getSiteUrl } from "@/src/utils/url";
import Head from "next/head";
import Script from "next/script";
import path from "path";
export default function BlogPage({ post }: { post: PostSelect }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post?.title,
    description: generatePostDescription(post),
    author: {
      "@type": "Person",
      name: post?.author?.name,
      url: `${getSiteUrl()}/author/${post?.author?.username}`,
    },
    datePublished: post?.published_at || post?.created_at,
    image:
      post?.featured_image?.url ||
      `${getSiteUrl()}/api/og?${objectToQueryParams({
        title: post?.title,
        date: post?.published_at || post?.created_at,
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
    articleSection: post?.category?.name,
    wordCount: post?.reading_time ? post?.reading_time * 200 : undefined, // Rough estimate based on reading time
  };
  return (
    <>
      <PostPage post={post as any} />;
    </>
  );
}
function generatePostDescription(post: any) {
  const description = shortenText(
    post?.summary || stripHtml(decodeAndSanitizeHtml(post?.content || "")),
    200
  );
  return description;
}
