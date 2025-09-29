import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// This is a server component
export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Create a Supabase client for server-side usage with environment variables
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch blog post by slug
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !blog) {
    console.error("Error fetching blog:", error);
    return notFound();
  }

  return (
    <article className="space-y-6 max-w-4xl mx-auto py-8">
      {blog.image && (
        <div className="mb-8">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold">{blog.title}</h1>

      <div className="flex items-center text-sm text-gray-600 space-x-4">
        {blog.created_at && (
          <span>
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
        {blog.author && <span>By {blog.author}</span>}
        {blog.category && (
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            {blog.category}
          </span>
        )}
      </div>

      <div className="prose max-w-none mt-8">{blog.content}</div>
    </article>
  );
}
