"use client";

import Link from "next/link";
import Image from "next/image";

interface CompactBlogCardProps {
  blog: {
    title: string;
    slug: string;
    excerpt: string;
    image?: string;
    featured_image?: string;
    author?: string;
  };
}

export function CompactBlogCard({ blog }: CompactBlogCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {/* Blog Thumbnail */}
        <div className="w-20 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {blog.featured_image || blog.image ? (
            <Image
              src={blog.featured_image || blog.image || ""}
              alt={blog.title}
              width={80}
              height={64}
              className="object-cover w-full h-full"
              loading="lazy"
              quality={80}
            />
          ) : (
            <span className="text-gray-400 text-xs font-medium text-center">
              No Image
            </span>
          )}
        </div>

        {/* Blog Details */}
        <div className="flex-grow overflow-hidden">
          {/* Blog Title */}
          <h4 className="text-sm font-semibold hover:text-purple-600 line-clamp-2 mb-2">
            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h4>

          {/* Excerpt */}
          <p className="text-gray-600 text-xs line-clamp-2">
            {blog.excerpt ||
              "Read this insightful article about AI tools and technology."}
          </p>
        </div>
      </div>
    </div>
  );
}
