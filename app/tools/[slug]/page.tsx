import { supabaseServer } from "@/utils/supabaseServer";
import { SupabaseCache } from "@/utils/supabaseOptimized";
import { getPublicImageUrl } from "@/utils/getPublicImageUrl";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ToolLogo } from "@/components/tools/ToolLogo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";
import { FeaturedTools } from "@/components/tools/FeaturedTool";
import { TopCategories } from "@/components/category/TopCategories";
import { ToolDetailSchema } from "@/components/schema/ToolDetailSchema";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { RelatedTools } from "@/components/tools/RelatedTools";

export const revalidate = 43200; // Revalidate every 12 hours (good balance for 4200+ tools)
export const dynamicParams = true; // Allow on-demand generation for tools not pre-generated

interface ToolDetailPageProps {
  params: Promise<{ slug: string }>;
}

// 🚀 Generate static paths at build time for top 500 tools (prioritized by recency)
// Other tools will be generated on-demand (dynamicParams = true)
export async function generateStaticParams() {
  try {
    console.log("Generating static params for top 500 most recent tools...");

    const { data, error } = await supabaseServer
      .from("tools_summary")
      .select("slug")
      .not("slug", "is", null)
      .order("created_at", { ascending: false }) // 🚀 Prioritize newest tools
      .limit(500);

    if (error) {
      console.error("Error fetching top tools:", error);
      return [];
    }

    const validTools = (data || []).filter(
      (tool) => tool.slug && tool.slug.trim(),
    );
    console.log(
      `✓ Generated static params for ${validTools.length} tools (pre-build, sorted by recency)`,
    );
    console.log(
      `ℹ Remaining ~${4200 - validTools.length} tools will be generated on-demand`,
    );

    return validTools.map((tool) => ({
      slug: tool.slug,
    }));
  } catch (err) {
    console.error("Error generating static params for tools:", err);
    return [];
  }
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data: toolSummary } = await supabaseServer
    .from("tools_summary")
    .select("tool_name, one_line_description")
    .eq("slug", slug)
    .single();

  if (!toolSummary) {
    return {
      title: "Tool Not Found | Transformik AI",
      alternates: {
        canonical: `https://www.transformik.com/tools/${slug}`,
      },
    };
  }

  const title = `${toolSummary.tool_name} - AI Tool Review | Transformik AI`;
  const description = toolSummary.one_line_description;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.transformik.com/tools/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.transformik.com/tools/${slug}`,
    },
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;

  // 🚀 Optimized Query: Fetch only required fields from tool summary
  const { data: toolSummary, error: summaryError } = await supabaseServer
    .from("tools_summary")
    .select(
      "id, tool_name, slug, one_line_description, pricing_model, url, logo, category",
    )
    .eq("slug", slug)
    .single();

  if (summaryError || !toolSummary) return notFound();

  // 🚀 Parallel queries: Fetch details, featured tools, and categories simultaneously (66% faster)
  const [detailsResult, featuredToolsResult, topCategories] = await Promise.all(
    [
      supabaseServer
        .from("tools_details")
        .select(
          "description, how_to_use, use_cases, pros, cons, pricing, screenshots, faqs",
        )
        .eq("id", toolSummary.id)
        .single(),
      supabaseServer
        .from("tools_summary")
        .select(
          "id, tool_name, slug, one_line_description, pricing_model, url, logo, category",
        )
        .neq("id", toolSummary.id)
        .limit(5),
      SupabaseCache.getTopCategories(6), // Cached category fetch
    ],
  );

  const { data: toolDetails, error: detailsError } = detailsResult;
  const { data: featuredTools } = featuredToolsResult;

  if (detailsError) console.error(detailsError);

  const logoUrl = getPublicImageUrl(
    "Images",
    toolSummary.logo ? `ToolLogos/${toolSummary.logo}` : undefined,
  );

  const screenshots = (toolDetails?.screenshots ?? [])
    .map((fileName: string) =>
      getPublicImageUrl("Images", `ToolScreenshot/${fileName}`),
    )
    .filter(Boolean) as string[];

  const faqs = toolDetails?.faqs ?? [];

  // Reusable section component for Description and Screenshots
  const ToolSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );

  return (
    <>
      {/* Schema Markup */}
      <ToolDetailSchema
        tool={{
          id: toolSummary.id,
          tool_name: toolSummary.tool_name,
          slug: toolSummary.slug,
          one_line_description: toolSummary.one_line_description,
          pricing_model: toolSummary.pricing_model,
          url: toolSummary.url,
          category: toolSummary.category,
          logo: logoUrl,
        }}
        toolDetails={
          toolDetails
            ? {
                description: toolDetails.description,
                how_to_use: toolDetails.how_to_use,
                use_cases: toolDetails.use_cases,
                pros: toolDetails.pros,
                cons: toolDetails.cons,
                pricing: toolDetails.pricing,
                screenshots: screenshots,
                faqs: faqs,
              }
            : undefined
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-10 gap-10">
        {/* Main Content */}
        <div className="md:col-span-7 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow border border-gray-100">
            {/* Header */}
            <div className="flex flex-col items-start gap-4">
              {/* Logo on top */}
              <div className="mb-2 flex items-center gap-4">
                <ToolLogo src={logoUrl} alt={`${toolSummary.tool_name} logo`} />
                <h1 className="text-3xl font-bold text-gray-900">
                  {toolSummary.tool_name}
                </h1>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-2">
                {/* <h1 className="text-3xl font-bold text-gray-900">
                {toolSummary.tool_name}
              </h1> */}
                <p className="text-gray-500">
                  {toolSummary.one_line_description}
                </p>
                <p className="font-semibold text-gray-700">
                  Price: {toolSummary.pricing_model}
                </p>

                {/* Categories as Badges */}
                {toolSummary.category && toolSummary.category.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 font-semibold text-gray-700">
                    Categories:
                    {toolSummary.category
                      .slice(0, 5)
                      .map((cat: string, idx: number) => (
                        <CategoryBadge key={idx} category={cat} />
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Visit Tool Button */}
            {toolSummary.url && (
              <div className="mt-6">
                <Button asChild variant="outline">
                  <a
                    href={toolSummary.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    Visit Tool
                  </a>
                </Button>
              </div>
            )}

            {/* Description */}
            {toolDetails?.description && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-gray-700 leading-relaxed">
                  {toolDetails.description}
                </CardContent>
              </Card>
            )}
            {/* Screenshots */}
            {screenshots.length > 0 && (
              <ToolSection title="">
                <div className="space-y-4">
                  {screenshots.map((url, idx) => (
                    <div
                      key={idx}
                      className="w-full overflow-hidden rounded-lg border border-gray-200"
                    >
                      <Image
                        src={url}
                        alt={`${toolSummary.tool_name} screenshot ${idx + 1}`}
                        width={1200}
                        height={675}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        className="w-full h-auto object-contain"
                        loading="lazy"
                        quality={85}
                      />
                    </div>
                  ))}
                </div>
              </ToolSection>
            )}

            {/* How to Use */}
            {toolDetails?.how_to_use && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    How to Use
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-700 leading-relaxed">
                  {toolDetails.how_to_use
                    .split("\n")
                    .filter((step: string) => step.trim())
                    .map((step: string, idx: number) => {
                      // Enhanced cleaning: remove "Step X:", numbers, bullets, dashes, etc.
                      const cleanStep = step
                        .replace(/^\s*step\s*\d+\s*:?\s*/i, "") // Remove "Step 1:", "Step 2:", etc. (case insensitive)
                        .replace(/^\s*[\d\.\•\-]+\s*/, "") // Remove leading numbers, bullets, or dashes
                        .trim();
                      return (
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="font-bold text-blue-600">
                            {idx + 1}.
                          </span>
                          <span>{cleanStep}</span>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            )}

            {/* Use Cases */}
            {toolDetails?.use_cases && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    Use Cases
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {toolDetails.use_cases
                      .split("\n")
                      .filter((uc: string) => uc.trim())
                      .map((uc: string, idx: number) => {
                        const cleanUc = uc.replace(/^\s*[\d\.\•\-]+\s*/, ""); // remove leading numbers, bullets, or dashes
                        return (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 whitespace-normal break-words"
                          >
                            <Lightbulb className="w-4 h-4 mr-1 text-blue-500" />
                            {cleanUc}
                          </Badge>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pros & Cons */}
            {(toolDetails?.pros || toolDetails?.cons) && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    Pros & Cons
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Pros */}
                  {toolDetails?.pros && (
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold text-green-600">
                        <CheckCircle className="w-5 h-5" /> Pros
                      </h3>
                      <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
                        {toolDetails.pros
                          .split("\n")
                          .filter((p: string) => p.trim())
                          .map((p: string, idx: number) => {
                            const cleanPros = p.replace(
                              /^\s*[\d\.\•\-]+\s*/,
                              "",
                            ); // remove leading bullets or numbers
                            return <li key={idx}>{cleanPros}</li>;
                          })}
                      </ul>
                    </div>
                  )}

                  {/* Cons */}
                  {toolDetails?.cons && (
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold text-red-600">
                        <XCircle className="w-5 h-5" /> Cons
                      </h3>
                      <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
                        {toolDetails.cons
                          .split("\n")
                          .filter((c: string) => c.trim())
                          .map((c: string, idx: number) => {
                            const cleanCons = c.replace(
                              /^\s*[\d\.\•\-]+\s*/,
                              "",
                            ); // remove leading bullets or numbers
                            return <li key={idx}>{cleanCons}</li>;
                          })}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Pricing */}
            {toolDetails?.pricing &&
              String(toolDetails.pricing).trim().toLowerCase() !== "nan" &&
              String(toolDetails.pricing).trim() !== "" && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Pricing
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-4 text-gray-700 leading-relaxed">
                    {/* Check if pricing value is a URL */}
                    {/^https?:\/\/[^\s]+$/i.test(toolDetails.pricing.trim()) ? (
                      // 🔗 Case 1: Pricing is a URL
                      <p className="text-gray-800">
                        To check the pricing of{" "}
                        <span className="font-semibold">
                          {toolSummary.tool_name}
                        </span>{" "}
                        <a
                          href={toolDetails.pricing.trim()}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="text-green-600 underline hover:text-blue-800"
                        >
                          click here
                        </a>
                      </p>
                    ) : (
                      // 📝 Case 2: Normal pricing text
                      <div className="space-y-3">
                        {toolDetails.pricing
                          .split(
                            /\.\s+(?=[A-Z])|(?:\n|\.)\s*(?=Free Plan:|Development Plan|Production Plan|Basic Plan:|Pro Plan:|Enterprise Plan|Premium Plan:|Starter Plan:|Business Plan:|Team Plan:|Individual Plan:|Monthly Plan:|Annual Plan:|Trial:|Refund Policy:)/g,
                          )
                          .filter((section: string) => section.trim())
                          .map((section: string, idx: number) => {
                            const trimmedSection = section.trim();

                            const isPlanHeader =
                              /^(Free Plan:|Development Plan|Production Plan|Basic Plan:|Pro Plan:|Enterprise Plan:|Premium Plan:|Starter Plan:|Business Plan:|Team Plan:|Individual Plan:|Monthly Plan:|Annual Plan:|Trial:|Refund Policy:)/i.test(
                                trimmedSection,
                              );

                            return isPlanHeader ? (
                              <div
                                key={idx}
                                className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg"
                              >
                                <div className="font-semibold text-gray-800">
                                  {trimmedSection}
                                </div>
                              </div>
                            ) : (
                              <div key={idx} className="pl-4 py-1">
                                <div className="text-gray-700">
                                  {trimmedSection}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    FAQs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="divide-y divide-gray-200"
                  >
                    {faqs.map(
                      (
                        faq: { question: string; answer: string },
                        idx: number,
                      ) => (
                        <AccordionItem
                          key={idx}
                          value={`faq-${idx}`}
                          className="py-2"
                        >
                          <AccordionTrigger className="text-left font-medium text-gray-800">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="mt-2 text-gray-600 text-balance pr-0">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ),
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Related Tools Section */}
          <RelatedTools
            currentToolId={toolSummary.id}
            categories={toolSummary.category || []}
          />
        </div>

        {/* Sidebar */}
        <aside className="md:col-span-3 space-y-8">
          <FeaturedTools limit={5} initialTools={featuredTools || []} />
          <TopCategories limit={6} initialCategories={topCategories} />
        </aside>
      </div>
    </>
  );
}
