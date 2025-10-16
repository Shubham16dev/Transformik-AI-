"use client";

import { useState, useEffect } from "react";
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
  const [blogs, setBlogs] = useState<BlogSummary[]>(initialBlogs);
  const [sortOption, setSortOption] = useState("date-desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // Blogs per page
  const totalPages = Math.ceil(blogs.length / pageSize);
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Sort blogs when sortOption changes
  useEffect(() => {
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
    setBlogs(sorted);
    setCurrentPage(1);
  }, [sortOption, initialBlogs]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>

      {/* Sort Select */}
      <div className="flex justify-end">
        <Select value={sortOption} onValueChange={setSortOption}>
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
          totalItems={blogs.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
