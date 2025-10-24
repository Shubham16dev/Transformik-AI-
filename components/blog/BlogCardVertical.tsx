"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogCardVerticalProps {
  blog: {
    title: string;
    slug: string;
    excerpt: string;
    image?: string;
    featured_image?: string;
    author?: string;
  };
}

export function BlogCardVertical({ blog }: BlogCardVerticalProps) {
  return (
    <Card className="rounded-xl border border-gray-200 p-6 w-full flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      {/* Blog Thumbnail */}
      <div className="w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center aspect-[16/9] mb-4">
        {blog.featured_image || blog.image ? (
          <Image
            src={blog.featured_image || blog.image || ""}
            alt={blog.title}
            width={400}
            height={225}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <span className="text-gray-400 text-sm font-medium text-center">
            No Thumbnail
          </span>
        )}
      </div>

      {/* Blog Details */}
      <div className="flex flex-col justify-between flex-grow">
        <div className="space-y-3">
          {/* Blog Title */}
          <h3 className="text-lg font-bold hover:text-purple-600 leading-snug line-clamp-2">
            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {blog.excerpt || "Discover insights about AI tools and technology."}
          </p>
        </div>

        {/* Read More Button */}
        <div className="mt-4 pt-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="w-full px-4 py-2 bg-gray-50 text-gray-800 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
          >
            <Link href={`/blog/${blog.slug}`}>Read More</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
