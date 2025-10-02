import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FeaturedTools } from "@/components/tools/FeaturedTool";
import { TopCategories } from "@/components/category/TopCategories";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>; // Change this to Promise
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params; // Await params here

  // Fetch blog summary
  const { data: summary, error: summaryError } = await supabase
    .from("blogs_summary")
    .select("*")
    .eq("slug", slug)
    .single();

  if (summaryError || !summary) return notFound();

  // Fetch blog details
  const { data: details, error: detailsError } = await supabase
    .from("blogs_details")
    .select("content")
    .eq("blog_id", summary.id)
    .single();

  if (detailsError || !details) return notFound();

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-10 px-4 md:px-8 py-6">
      {/* Main Content */}
      <div className="md:col-span-7 space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 space-y-6">
          {/* Blog Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {summary.image && (
              <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <Image
                  src={summary.image}
                  alt={summary.title}
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{summary.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mt-2">
                {summary.created_at && (
                  <span>
                    {new Date(summary.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
                {summary.author && <span>By {summary.author}</span>}
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="prose max-w-none mt-4">{details.content}</div>

          {/* Optional Action */}
          {summary.url && (
            <div className="flex flex-wrap gap-4 mt-4">
              <Button asChild variant="outline">
                <a href={summary.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="md:col-span-3 space-y-8">
        <FeaturedTools limit={5} />
        <TopCategories limit={6} />
      </div>
    </div>
  );
}