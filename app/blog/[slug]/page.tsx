import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { FeaturedTools } from "@/components/tools/FeaturedTool";
import { TopCategories } from "@/components/category/TopCategories";
import parse from "html-react-parser";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

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
    .eq("id", summary.id)
    .single();

  if (detailsError || !details) return notFound();
  // formatted date for display in hero/meta
  const formattedDate = summary.created_at
    ? new Date(summary.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // safe fallbacks for image/avatar/excerpt fields (DB column names may vary)
  const heroImage =
    summary.featured_image || summary.image || summary.cover_image || null;
  const authorImage = summary.author_image || summary.avatar || null;
  const excerpt =
    summary.excerpt || summary.description || summary.summary || null;

  return (
    <div>
      {/* Hero section: title left, image right */}
      <section className="bg-[#281d43] text-white py-16 w-full">
        <div className="max-w-9xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-10 gap-6 items-center">
          <div className="md:col-span-7">
            {/* optional small category or label - keep if available */}
            {summary.category && (
              <p className="text-sm uppercase tracking-wider text-white/90 mb-4">
                {summary.category}
              </p>
            )}
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              {summary.title}
            </h1>
            {excerpt && (
              <p className="mt-6 text-lg text-white/90 max-w-2xl">{excerpt}</p>
            )}
            {/* show created date and author if available */}
            {summary.created_at && (
              <div className="mt-4 text-sm text-white/80">
                {new Date(summary.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}
          </div>

          <div className="md:col-span-3 flex justify-end">
            {heroImage ? (
              <img
                src={heroImage}
                alt={summary.title}
                className="w-full max-w-[360px] object-cover rounded-lg "
              />
            ) : (
              <div className="w-full max-w-[360px] h-44 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white/70">No image</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-10 px-4 md:px-8 py-6">
        {/* Main Content */}
        <div className="md:col-span-7 space-y-8">
          <div className="bg-white p-8 rounded-lg border border-gray-100 space-y-6">
            {/* Blog Content */}
            <div className="prose max-w-none mt-4">
              {parse(details.content || "")}
            </div>

            {/* Optional Action */}
            {summary.url && (
              <div className="flex flex-wrap gap-4 mt-4">
                <Button asChild variant="outline">
                  <a
                    href={summary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
    </div>
  );
}
