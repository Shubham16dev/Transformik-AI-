import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  blog: {
    title: string;
    slug: string;
    excerpt: string;
    image?: string;
    author?: string;
    category?: string;
  };
}

// Category capsule color
function getCategoryColor(category?: string) {
  const colors: Record<string, string> = {
    AI: "bg-purple-100 text-purple-800",
    Productivity: "bg-indigo-100 text-indigo-800",
    Design: "bg-pink-100 text-pink-800",
    Marketing: "bg-orange-100 text-orange-800",
    General: "bg-gray-100 text-gray-800", // Default color for general
  };
  return colors[category || "General"] || "bg-gray-200 text-gray-800";
}

export function BlogCard({ blog }: BlogCardProps) {
  const authorName = blog.author || "Harsh Mistry";
  const categoryName = blog.category || "General";

  const imageHeight = 144; // px

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 rounded-xl border p-4 w-full flex flex-col md:flex-row gap-4">
      {/* Left Column: Image */}
      <div
        className="w-full md:w-1/3 min-w-[120px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
        style={{ height: '144px' }}
      >
        {blog.image ? (
          <Image
            src={blog.image}
            alt={blog.title}
            width={144}
            height={144}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-400 text-sm font-medium text-center">
            No Thumbnail
          </span>
        )}
      </div>

      {/* Right Column: Details */}
      <div className="flex flex-col justify-between flex-grow" style={{ minHeight: '144px' }}>
        <div className="space-y-1 overflow-hidden">
          {/* Category */}
          <span
            className={`inline-block text-xs font-medium px-2 py-1 ${getCategoryColor(
              categoryName
            )}`}
          >
            {categoryName}
          </span>

          {/* Title */}
          <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors truncate">
            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h3>

          {/* Excerpt with line clamp */}
          <p className="text-gray-600 text-sm line-clamp-3">{blog.excerpt}</p>

          {/* Author */}
          <p className="text-gray-500 text-xs">By {authorName}</p>
        </div>

        {/* Button: left-aligned near image */}
        <div className="mt-2 flex-shrink-0">
          <Button
            asChild
            size="sm"
            className="px-4 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            <Link href={`/blog/${blog.slug}`}>Read More</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}