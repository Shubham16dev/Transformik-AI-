"use client";

import { useEffect, useRef } from "react";
import parse from "html-react-parser";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Add IDs to headings that don't have them
      const headings = contentRef.current.querySelectorAll("h2, h3");
      headings.forEach((heading, index) => {
        if (!heading.id) {
          const text = heading.textContent || "";
          const id =
            text
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
              .trim() || `heading-${index}`;
          heading.id = id;
        }
      });
    }
  }, [content]);

  return (
    <div ref={contentRef} className="prose max-w-none mt-4">
      {parse(content || "")}
    </div>
  );
}
