"use client";
import {
  example,
  generateTableOfContents,
  parseHtmlHeadings,
  TocItem,
} from "@/src/lib/toc-generator";
import { useState } from "react";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";

const TOCItemComponent = ({
  item,
  depth = 0,
}: {
  item: TocItem;
  depth?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children.length > 0;

  return (
    <div style={{ marginLeft: `${depth * 16}px` }}>
      <div
        className="flex items-center gap-2 py-1 hover:bg-gray-100 cursor-pointer"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <span className="w-4 text-gray-500">
            {isExpanded ? <LuChevronDown /> : <LuChevronRight />}
          </span>
        )}
        <a href={`#${item.id}`} className="text-gray-700 hover:text-blue-600">
          {item.text}
        </a>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {item.children.map((child) => (
            <TOCItemComponent key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const TOCRenderer = ({ content }: { content: string }) => {
  const parsedContent = parseHtmlHeadings(content);
  const tocData = parsedContent.toc;

  return (
    <div className="w-full max-w-md border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      {tocData.map((item) => (
        <TOCItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
};
