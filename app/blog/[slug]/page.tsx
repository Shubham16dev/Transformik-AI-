import { notFound } from "next/navigation";

const mockBlogs = [
  {
    title: "Top 10 AI Tools in 2025",
    slug: "top-10-ai-tools",
    content: "Here are the top 10 AI tools you must know in 2025...",
  },
  {
    title: "How AI Changes Productivity",
    slug: "ai-productivity",
    content: "AI is transforming productivity in workplaces...",
  },
];

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = mockBlogs.find((b) => b.slug === params.slug);
  if (!blog) return notFound();

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <p className="text-gray-700 leading-relaxed">{blog.content}</p>
    </article>
  );
}
