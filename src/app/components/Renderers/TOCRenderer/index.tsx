"use client";
import { parseHtmlHeadings, TocItem } from "@/src/lib/toc-generator";
import { useState, useEffect, useRef, useMemo } from "react";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";

const TOCItemComponent = ({
  item,
  depth = 0,
  activeId,
}: {
  item: TocItem;
  depth?: number;
  activeId: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const itemRef = useRef<HTMLDivElement>(null);
  const hasChildren = item.children.length > 0;
  const isActive = activeId === item.id;

  // Check if this item or any of its children are active
  const isActiveOrHasActiveChild = useMemo(() => {
    const checkActive = (item: TocItem): boolean => {
      if (item.id === activeId) return true;
      return item.children.some(checkActive);
    };
    return checkActive(item);
  }, [item, activeId]);

  // Auto-expand and scroll into view when active
  useEffect(() => {
    if (isActiveOrHasActiveChild) {
      setIsExpanded(true);
    }
  }, [isActiveOrHasActiveChild]);

  return (
    <div ref={itemRef} style={{ marginLeft: `${depth * 16}px` }}>
      <div
        className={`flex items-center gap-2 py-1 hover:bg-gray-100 cursor-pointer ${
          isActive ? "bg-gray-100 font-medium text-blue-600" : ""
        }`}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <span className="w-4 text-gray-500">
            {isExpanded ? <LuChevronDown /> : <LuChevronRight />}
          </span>
        )}
        <a
          href={`#${item.id}`}
          className={`text-gray-700 hover:text-blue-600 ${isActive ? "text-blue-600" : ""}`}
        >
          {item.text}
        </a>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {item.children.map((child) => (
            <TOCItemComponent
              key={child.id}
              item={child}
              depth={depth + 1}
              activeId={activeId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TOCRenderer = ({ content }: { content: string }) => {
  const parsedContent = parseHtmlHeadings(content);
  const tocData = parsedContent.toc;
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    // Observe all headings
    document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full max-w-md border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      {tocData.map((item) => (
        <TOCItemComponent key={item.id} item={item} activeId={activeId} />
      ))}
    </div>
  );
};
