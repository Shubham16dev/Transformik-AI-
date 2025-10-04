import { supabase } from "@/utils/supabase";
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

interface ToolDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data: toolSummary } = await supabase
    .from("tools_summary")
    .select("tool_name, one_line_description")
    .eq("slug", slug)
    .single();

  if (!toolSummary) return { title: "Tool Not Found" };

  return {
    title: `${toolSummary.tool_name} - AI Tool`,
    description: toolSummary.one_line_description,
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;

  // 1️⃣ Fetch main tool summary
  const { data: toolSummary, error: summaryError } = await supabase
    .from("tools_summary")
    .select("*")
    .eq("slug", slug)
    .single();

  if (summaryError || !toolSummary) return notFound();

  // 2️⃣ Fetch tool details
  const { data: toolDetails, error: detailsError } = await supabase
    .from("tools_details")
    .select("*")
    .eq("id", toolSummary.id)
    .single();

  if (detailsError) console.error(detailsError);

  const logoUrl = getPublicImageUrl(
    "Images",
    toolSummary.logo ? `ToolLogos/${toolSummary.logo}` : undefined
  );

  const screenshots = (toolDetails?.screenshots ?? [])
    .map((fileName: string) =>
      getPublicImageUrl("Images", `ToolScreenshot/${fileName}`)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-10 gap-10">
      {/* Main Content */}
      <div className="md:col-span-7 space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow border border-gray-100">
          {/* Header */}
          <div className="flex flex-col items-start gap-4">
            {/* Logo on top */}
            <div className="mb-2">
              <ToolLogo src={logoUrl} alt={`${toolSummary.tool_name} logo`} />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {toolSummary.tool_name}
              </h1>
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
                  {toolSummary.category.map((cat: string, idx: number) => (
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
                  rel="noopener noreferrer"
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
            <ToolSection title="Screenshots">
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
                      height={0}
                      sizes="100vw"
                      className="w-full h-auto object-contain"
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
                    const cleanStep = step.replace(/^\s*[\d\.\•\-]+\s*/, ""); // remove leading numbers, bullets, or dashes
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
                          const cleanPros = p.replace(/^\s*[\d\.\•\-]+\s*/, ""); // remove leading bullets or numbers
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
                          const cleanCons = c.replace(/^\s*[\d\.\•\-]+\s*/, ""); // remove leading bullets or numbers
                          return <li key={idx}>{cleanCons}</li>;
                        })}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pricing */}
          {toolDetails?.pricing && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-gray-700 leading-relaxed">
                {toolDetails.pricing}
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
                      idx: number
                    ) => (
                      <AccordionItem
                        key={idx}
                        value={`faq-${idx}`}
                        className="py-2"
                      >
                        <AccordionTrigger className="text-left font-medium text-gray-800">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="mt-2 text-gray-600 text-balance">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* Screenshots */}
          {/* {screenshots.length > 0 && (
            <ToolSection title="Screenshots">
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
                      height={0}
                      sizes="100vw"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </ToolSection>
          )} */}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="md:col-span-3 space-y-8">
        <FeaturedTools limit={5} />
        <TopCategories limit={6} />
      </aside>
    </div>
  );
}
