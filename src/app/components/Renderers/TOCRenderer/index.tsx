"use client";
import { example, parseHtmlHeadings } from "@/src/lib/toc-generator";

export const TOCRenderer = ({ content }: { content: string }) => {
  console.log(example());
  console.log(parseHtmlHeadings(content));

  return <div>TOCRenderer</div>;
};
