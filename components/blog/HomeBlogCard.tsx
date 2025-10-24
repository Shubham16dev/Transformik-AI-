"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HomeBlogCardProps {
  blog: {
    title: string;
    slug: string;
    excerpt: string;
    image?: string;
    featured_image?: string;
    author?: string;
  };
}

export function HomeBlogCard({ blog }: HomeBlogCardProps) {
  return (
    <Card className="rounded-xl border border-gray-200 p-4 w-full flex flex-col md:flex-row gap-4">
      {/* Blog Thumbnail */}
      <div className="w-full md:w-1/3 min-w-[120px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center aspect-[5/3]">
        {blog.featured_image || blog.image ? (
          <img
            src={blog.featured_image || blog.image || ""}
            alt={blog.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-400 text-sm font-medium text-center">
            No Thumbnail
          </span>
        )}
      </div>

      {/* Blog Details */}
      <div className="flex flex-col justify-between flex-grow">
        <div className="space-y-2 overflow-hidden">
          {/* Blog Title */}
          <h3 className="text-lg font-bold hover:text-purple-600 text-ellipsis">
            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-3">
            {blog.excerpt || "Discover insights about AI tools and technology."}
          </p>
        </div>

        {/* Read More Button */}
        <div className="mt-2 flex-shrink-0">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="px-4 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            <Link href={`/blog/${blog.slug}`}>Read More</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
