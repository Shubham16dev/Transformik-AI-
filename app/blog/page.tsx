"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { BlogCard } from "@/components/blog/BlogCard";
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
  author?: string;
  created_at: string;
}

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogSummary[]>([]);
  const [sortOption, setSortOption] = useState("date-desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Blogs per page
  const totalPages = Math.ceil(filteredBlogs.length / pageSize);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Fetch blogs from blogs_summary table
  useEffect(() => {
    async function fetchBlogs() {
      const { data, error } = await supabase
        .from("blogs_summary")
        .select("id, title, slug, excerpt, image, author, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error.message);
        return;
      }

      setBlogs(data || []);
      setFilteredBlogs(data || []);
    }

    fetchBlogs();
  }, []);

  // Sort blogs when sortOption changes
  useEffect(() => {
    const sorted = [...blogs];
    if (sortOption === "date-desc") {
      sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === "date-asc") {
      sorted.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    setFilteredBlogs(sorted);
    setCurrentPage(1);
  }, [sortOption, blogs]);

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
            <BlogCard key={blog.id} blog={blog} /> 
          ))
        ) : (
          <p className="text-gray-500">No blogs found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          totalItems={filteredBlogs.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}