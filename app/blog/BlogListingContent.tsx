"use client";

import { useState, useMemo } from "react";
import { HomeBlogCard } from "@/components/blog/HomeBlogCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/Pagination";

interface BlogSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  featured_image?: string;
  author?: string;
  created_at: string;
}

interface BlogListingContentProps {
  initialBlogs: BlogSummary[];
}

export function BlogListingContent({ initialBlogs }: BlogListingContentProps) {
  const [sortOption, setSortOption] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8; // Blogs per page

  // Sort blogs using useMemo to prevent hydration issues
  const sortedBlogs = useMemo(() => {
    const sorted = [...initialBlogs];
    if (sortOption === "date-desc") {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === "date-asc") {
      sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    return sorted;
  }, [sortOption, initialBlogs]);

  const totalPages = Math.ceil(sortedBlogs.length / pageSize);
  const paginatedBlogs = sortedBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>

      {/* Sort Select */}
      <div className="flex justify-end">
        <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedBlogs.length > 0 ? (
          paginatedBlogs.map((blog) => (
            <HomeBlogCard key={blog.id} blog={blog} />
          ))
        ) : (
          <p className="text-gray-500">No blogs found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          totalItems={sortedBlogs.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
