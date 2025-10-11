import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { FeaturedTools } from "@/components/tools/FeaturedTool";
import { TopCategories } from "@/components/category/TopCategories";
import Image from "next/image";
import parse from "html-react-parser";
import type { Metadata } from "next";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data: blogSummary } = await supabase
    .from("blogs_summary")
    .select("title, excerpt, featured_image, image, cover_image")
    .eq("slug", slug)
    .single();

  if (!blogSummary) {
    return {
      title: "Blog Post Not Found | Transformik AI",
      alternates: {
        canonical: `https://www.transformik.com/blog/${slug}`,
      },
    };
  }

  const title = `${blogSummary.title} | Transformik AI Blog`;
  const description = blogSummary.excerpt || blogSummary.title;
  const image =
    blogSummary.featured_image || blogSummary.image || blogSummary.cover_image;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.transformik.com/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.transformik.com/blog/${slug}`,
      images: image ? [{ url: image }] : undefined,
    },
  };
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
  // safe fallbacks for image/excerpt fields (DB column names may vary)
  const heroImage =
    summary.featured_image || summary.image || summary.cover_image || null;
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
              <div className="w-full max-w-[360px] rounded-lg overflow-hidden">
                <Image
                  src={heroImage}
                  alt={summary.title}
                  width={720}
                  height={480}
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover w-full h-full"
                />
              </div>
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
