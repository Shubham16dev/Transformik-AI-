"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h2, h3");

    const items: TOCItem[] = Array.from(headings).map((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || "";
      const id = heading.id || `heading-${index}`;

      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = id;
      }

      return { id, text, level };
    });

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    // Set up intersection observer for active heading detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0.1,
      }
    );

    // Observe all headings
    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white lg:p-6 rounded-lg lg:border lg:border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 hidden lg:block">
        Table of Contents
      </h3>
      <nav className="space-y-2">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`
              block w-full text-left text-sm transition-colors duration-200
              ${item.level === 2 ? "font-medium" : "font-normal pl-4"}
              ${
                activeId === item.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600"
              }
              px-3 py-2 rounded-md
            `}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
