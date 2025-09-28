import { BlogCard } from "@/components/blog/BlogCard";

const mockBlogs = [
  { title: "Top 10 AI Tools in 2025", slug: "top-10-ai-tools", excerpt: "Discover trending AI tools..." },
  { title: "How AI Changes Productivity", slug: "ai-productivity", excerpt: "AI is boosting workflow efficiency..." },
];

export default function BlogListingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockBlogs.map((blog) => (
          <BlogCard key={blog.slug} blog={blog} />
        ))}
      </div>
    </div>
  );
}
