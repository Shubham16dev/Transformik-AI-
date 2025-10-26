"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface PaginationSEOProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export function PaginationSEO({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationSEOProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Remove existing pagination SEO links
    const existingLinks = document.querySelectorAll(
      'link[rel="prev"], link[rel="next"], link[rel="first"], link[rel="last"]'
    );
    existingLinks.forEach((link) => link.remove());

    // Create new pagination SEO links
    const head = document.head;
    const currentUrl = baseUrl || `https://www.transformik.com${pathname}`;

    // Previous page link
    if (currentPage > 1) {
      const prevLink = document.createElement("link");
      prevLink.rel = "prev";
      prevLink.href =
        currentPage === 2
          ? currentUrl
          : `${currentUrl}?page=${currentPage - 1}`;
      head.appendChild(prevLink);
    }

    // Next page link
    if (currentPage < totalPages) {
      const nextLink = document.createElement("link");
      nextLink.rel = "next";
      nextLink.href = `${currentUrl}?page=${currentPage + 1}`;
      head.appendChild(nextLink);
    }

    // First page link (only if not on first page)
    if (currentPage > 1) {
      const firstLink = document.createElement("link");
      firstLink.rel = "first";
      firstLink.href = currentUrl;
      head.appendChild(firstLink);
    }

    // Last page link (only if not on last page)
    if (currentPage < totalPages) {
      const lastLink = document.createElement("link");
      lastLink.rel = "last";
      lastLink.href = `${currentUrl}?page=${totalPages}`;
      head.appendChild(lastLink);
    }

    return () => {
      // Cleanup on unmount
      const linksToRemove = document.querySelectorAll(
        'link[rel="prev"], link[rel="next"], link[rel="first"], link[rel="last"]'
      );
      linksToRemove.forEach((link) => link.remove());
    };
  }, [currentPage, totalPages, pathname, searchParams, baseUrl]);

  return null; // This component doesn't render anything visible
}
