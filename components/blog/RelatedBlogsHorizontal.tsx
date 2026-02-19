"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { BlogCardVertical } from "./BlogCardVertical";

interface RelatedBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
}

interface RelatedBlogsHorizontalProps {
  currentBlogId: string;
  currentBlogSlug: string;
  category?: string;
  limit?: number;
  initialBlogs?: RelatedBlog[];
}

export function RelatedBlogsHorizontal({
  currentBlogId,
  currentBlogSlug,
  category,
  limit = 3,
  initialBlogs,
}: RelatedBlogsHorizontalProps) {
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>(
    initialBlogs ?? [],
  );
  const [loading, setLoading] = useState(initialBlogs ? false : true);

  useEffect(() => {
    if (initialBlogs) return;
    const fetchRelatedBlogs = async () => {
      try {
        // 🚀 Optimized: Only fetch required fields
        const { data: allBlogs, error: allError } = await supabase
          .from("blogs_summary")
          .select("id, title, slug, excerpt, featured_image")
          .neq("id", currentBlogId)
          .limit(limit);
        let finalBlogs: RelatedBlog[] = [];
        if (!allError && allBlogs && allBlogs.length > 0) {
          const transformedBlogs: RelatedBlog[] = allBlogs
            .slice(0, limit)
            .map((blog) => ({
              id: blog.id,
              title: blog.title,
              slug: blog.slug,
              excerpt:
                blog.excerpt ||
                "Discover insights about AI tools and technology.",
              featured_image: blog.featured_image,
            }));
          finalBlogs = transformedBlogs;
        } else {
          // 🚀 Optimized: Only fetch required fields for fallback
          const { data: emergencyBlogs } = await supabase
            .from("blogs_summary")
            .select("id, title, slug, excerpt, featured_image")
            .limit(limit);
          if (emergencyBlogs && emergencyBlogs.length > 0) {
            const filteredBlogs = emergencyBlogs.filter(
              (blog) => blog.id !== currentBlogId,
            );
            const transformedBlogs: RelatedBlog[] = filteredBlogs.map(
              (blog) => ({
                id: blog.id,
                title: blog.title,
                slug: blog.slug,
                excerpt:
                  blog.excerpt ||
                  "Discover insights about AI tools and technology.",
                featured_image: blog.featured_image,
              }),
            );
            finalBlogs = transformedBlogs;
          }
        }
        setRelatedBlogs(finalBlogs);
      } catch {
        setRelatedBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRelatedBlogs();
  }, [currentBlogId, currentBlogSlug, category, limit, initialBlogs]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-900">
          Related Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 animate-pulse"
            >
              <div className="aspect-[5/3] bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedBlogs.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-900">
          Related Articles
        </h3>
        <div className="text-gray-500 text-center py-8">
          No related articles found at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedBlogs.map((blog) => (
          <BlogCardVertical key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
