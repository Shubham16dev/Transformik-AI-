import { supabase } from "@/utils/supabase"
import { getPublicImageUrl } from "@/utils/getPublicImageUrl"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ToolLogo } from "@/components/tools/ToolLogo"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Metadata } from "next"
import { FeaturedTools } from "@/components/tools/FeaturedTool"
import { TopCategories } from "@/components/category/TopCategories"

interface ToolDetailPageProps {
  params: { slug: string }
}


// Dynamic metadata
export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { data: toolSummary } = await supabase
    .from("tools_summary")
    .select("tool_name, one_line_description")
    .eq("slug", params.slug)
    .single()

  if (!toolSummary) return { title: "Tool Not Found" }

  return {
    title: `${toolSummary.tool_name} - AI Tool`,
    description: toolSummary.one_line_description,
  }
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = params

  // 1️⃣ Fetch main tool summary
  const { data: toolSummary, error: summaryError } = await supabase
    .from("tools_summary")
    .select("*")
    .eq("slug", slug)
    .single()

  if (summaryError || !toolSummary) return notFound()

  // 2️⃣ Fetch tool details
  const { data: toolDetails, error: detailsError } = await supabase
    .from("tools_details")
    .select("*")
    .eq("id", toolSummary.id)
    .single()

  if (detailsError) console.error(detailsError)

 

  const logoUrl = getPublicImageUrl("Logo_Images", toolSummary.logo)
  const screenshots: string[] =
    toolDetails?.screenshots
      ?.filter((s: unknown): s is string => typeof s === "string" && !!s)
      .map((s: string) => getPublicImageUrl("Tool_Screenshots", s))
      .filter((url: unknown): url is string => typeof url === "string" && !!url) ?? []

  const faqs = toolDetails?.faqs ?? []

  // Reusable section component
  const ToolSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <div className="text-gray-600 mt-2">{children}</div>
    </section>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-10 gap-10">
      {/* Main Content */}
      <div className="md:col-span-7 space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow border border-gray-100">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <ToolLogo src={logoUrl} alt={`${toolSummary.tool_name} logo`}  />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{toolSummary.tool_name}</h1>
              <p className="text-gray-500 mt-1">{toolSummary.one_line_description}</p>
              <p className="mt-2 font-semibold text-gray-700">Price: {toolSummary.pricing_model}</p>
              <p className="mt-1 font-medium text-gray-700">Category: {toolSummary.category}</p>
            </div>
          </div>

          {toolSummary.url && (
            <div className="mt-6">
              <Button asChild variant="outline">
                <a href={toolSummary.url} target="_blank" rel="noopener noreferrer">
                  Visit Tool
                </a>
              </Button>
            </div>
          )}

          {/* Tool Details */}
          {toolDetails?.description && <ToolSection title="Description">{toolDetails.description}</ToolSection>}
          {toolDetails?.how_to_use && <ToolSection title="How to Use">{toolDetails.how_to_use}</ToolSection>}
          {toolDetails?.use_cases && <ToolSection title="Use Cases">{toolDetails.use_cases}</ToolSection>}
          {(toolDetails?.pros || toolDetails?.cons) && (
            <ToolSection title="Pros & Cons">
              {toolDetails.pros && <p><b>Pros.</b> {toolDetails.pros}</p>}
              {toolDetails.cons && <p><b>Cons</b> {toolDetails.cons}</p>}
            </ToolSection>
          )}

          {/* FAQs */}
          {faqs.length > 0 && (
            <ToolSection title="FAQs">
              <Accordion type="single" collapsible className="divide-y divide-gray-200">
                {faqs.map((faq: { question: string; answer: string }, idx: number) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="py-2">
                    <AccordionTrigger className="text-left font-medium text-gray-800">{faq.question}</AccordionTrigger>
                    <AccordionContent className="mt-2 text-gray-600 text-balance">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ToolSection>
          )}

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <ToolSection title="Screenshots">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {screenshots.map((url, idx) => (
                  <Image
                    key={idx}
                    src={url}
                    alt={`${toolSummary.tool_name} screenshot ${idx + 1}`}
                    width={400}
                    height={300}
                    className="rounded-lg object-cover"
                  />
                ))}
              </div>
            </ToolSection>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="md:col-span-3 space-y-8">
        <FeaturedTools limit={5} />
        <TopCategories limit={6} />
      </aside>
    </div>
  )
}
