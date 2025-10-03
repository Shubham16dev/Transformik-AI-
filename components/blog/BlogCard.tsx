"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Export the type so other components can use it
export type BlogCategory =
  | "Writing & Editing"
  | "Technology"
  | "Education"
  | "Health & Wellness"
  | "Business"
  | "Marketing"
  | "AI & ML"
  | "Lifestyle"
  | "Finance"
  | "Other";

interface BlogCardProps {
  blog: {
    title: string;
    slug: string;
    excerpt: string;
    image?: string;
    author?: string;
    category?: BlogCategory;
  };
}

// Map enum values to purple theme colors
// function getCategoryColor(category?: BlogCategory) {
//   const colors: Record<BlogCategory, string> = {
//     "Writing & Editing": "bg-blue-100 text-blue-800",
//     Technology: "bg-green-100 text-green-800",
//     Education: "bg-yellow-100 text-yellow-800",
//     "Health & Wellness": "bg-red-100 text-red-800",
//     Business: "bg-teal-100 text-teal-800",
//     Marketing: "bg-orange-100 text-orange-800",
//     "AI & ML": "bg-purple-100 text-purple-800",
//     Lifestyle: "bg-pink-100 text-pink-800",
//     Finance: "bg-indigo-100 text-indigo-800",
//     Other: "bg-gray-100 text-gray-800",
//   };
//   return category ? colors[category] : colors.Other;
// }

export function BlogCard({ blog }: BlogCardProps) {
  const authorName = blog.author || "Harsh Mistry";
  

  return (
    <Card
      className="hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-200 p-4 w-full flex flex-col md:flex-row gap-4"
    >
      {/* Blog Thumbnail */}
      <div className="w-full md:w-1/3 min-w-[120px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center  aspect-[5/3]">
        {blog.image ? (
          <Image
            src={blog.image}
            alt={blog.title}
            width={400}
            height={250}
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
          {/* Category Badge */}
          {/* <span
            className={`inline-block text-xs font-semibold px-2 py-1 rounded-md ${getCategoryColor(
              categoryName as BlogCategory
            )}`}
          >
            {categoryName}
          </span> */}

          {/* Blog Title */}
          <h3 className="text-lg font-bold hover:text-purple-600  text-ellipsis">
            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-3">{blog.excerpt}</p>

          {/* Author */}
          <p className="text-gray-500 text-xs">By {authorName}</p>
        </div>

        {/* Read More Button */}
        <div className="mt-2 flex-shrink-0">
          <Button asChild size="sm" variant="outline" className="px-4 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300">
            <Link href={`/blog/${blog.slug}`}>Read More</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}