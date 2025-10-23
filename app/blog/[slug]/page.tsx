import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";
import { Button } from "@/components/ui/button";
import { FeaturedTools } from "@/components/tools/FeaturedTool";
import { TopCategories } from "@/components/category/TopCategories";
import { RelatedBlogsHorizontal } from "@/components/blog/RelatedBlogsHorizontal";
import { BlogSchema } from "@/components/schema/BlogSchema";
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
  const imagePath =
    blogSummary.featured_image || blogSummary.image || blogSummary.cover_image;

  let image = undefined;
  if (imagePath) {
    // Try different path structures
    image = getPublicImageUrl("Images", `BlogImages/${imagePath}`);
    if (!image) {
      image = getPublicImageUrl("Images", imagePath);
    }
    if (!image && imagePath.startsWith("http")) {
      image = imagePath;
    }
  }

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

  // Fetch featured tools (SSR)
  const { data: featuredToolsData } = await supabase
    .from("tools_summary")
    .select(
      "id, tool_name, slug, logo, one_line_description, pricing_model, url, category"
    )
    .limit(30);
  const featuredTools =
    featuredToolsData && featuredToolsData.length > 0
      ? featuredToolsData.sort(() => Math.random() - 0.5).slice(0, 5)
      : [];

  // Fetch related blogs (SSR)
  const { data: relatedBlogsData } = await supabase
    .from("blogs_summary")
    .select("id, title, slug, excerpt, featured_image")
    .neq("id", summary.id)
    .limit(3);
  const relatedBlogs =
    relatedBlogsData && relatedBlogsData.length > 0
      ? relatedBlogsData.map((blog) => ({
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          excerpt:
            blog.excerpt || "Discover insights about AI tools and technology.",
          featured_image: blog.featured_image,
        }))
      : [];

  // safe fallbacks for image/excerpt fields (DB column names may vary)
  const heroImagePath =
    summary.featured_image || summary.image || summary.cover_image || null;

  // Try different path structures for images
  let heroImage = null;
  if (heroImagePath) {
    // Check if it's already a full URL
    if (heroImagePath.startsWith("http")) {
      heroImage = heroImagePath;
    } else {
      // Try with BlogImages folder first
      heroImage = getPublicImageUrl("Images", `BlogImages/${heroImagePath}`);

      // If that doesn't work, try direct path
      if (!heroImage) {
        heroImage = getPublicImageUrl("Images", heroImagePath);
      }
    }
  }

  const excerpt =
    summary.excerpt || summary.description || summary.summary || null;

  return (
    <>
      {/* Schema Markup */}
      <BlogSchema
        blog={{
          id: summary.id,
          title: summary.title,
          slug: summary.slug,
          excerpt: excerpt || undefined,
          author: summary.author,
          created_at: summary.created_at,
          featured_image: summary.featured_image,
          image: summary.image,
          cover_image: summary.cover_image,
          category: summary.category,
        }}
        content={details.content}
        isListingPage={false}
      />

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
                <p className="mt-6 text-lg text-white/90 max-w-2xl">
                  {excerpt}
                </p>
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
                    unoptimized
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
            <FeaturedTools limit={5} initialTools={featuredTools} />
            <TopCategories limit={6} />
          </div>
        </div>

        {/* Related Articles Section - Full Width */}
        <div className="px-4 md:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white p-8 rounded-lg border border-gray-100">
              <RelatedBlogsHorizontal
                currentBlogId={summary.id}
                currentBlogSlug={summary.slug}
                category={summary.category}
                limit={3}
                initialBlogs={relatedBlogs}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
