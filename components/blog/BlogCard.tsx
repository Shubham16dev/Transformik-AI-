import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface BlogCardProps {
  blog: {
    title: string;
    slug: string;
    excerpt: string;
  };
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="space-y-2">
        <h3 className="text-lg font-semibold">
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p className="text-gray-600 text-sm">{blog.excerpt}</p>
        <Link
          href={`/blog/${blog.slug}`}
          className="text-blue-600 text-sm hover:underline"
        >
          Read More
        </Link>
      </CardContent>
    </Card>
  );
}
