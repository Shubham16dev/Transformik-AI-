import { supabaseServer } from "@/utils/supabaseServer";
import { FreeToolsContent } from "./FreeToolsContent";

import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] }>;
}): Promise<Metadata> {
  const sp = (await searchParams) || {};
  const pageParam = sp.page;
  const currentPage = parseInt(
    Array.isArray(pageParam) ? pageParam[0] : pageParam || "1",
    10
  );
  const canonicalUrl = `https://www.transformik.com/free-tools${
    currentPage > 1 ? `?page=${currentPage}` : ""
  }`;

  const baseTitle =
    "Free AI Tools | Discover Best Free AI Tools - Transformik AI";
  const baseDescription =
    "Explore our collection of completely free AI tools. Find free tools for writing, coding, design, marketing, and more. No credit card required.";

  const title = currentPage > 1 
    ? `${baseTitle} | Page ${currentPage}` 
    : baseTitle;

  const description = currentPage > 1
    ? `Browse page ${currentPage} of ${baseTitle.toLowerCase()}. Continue exploring our comprehensive collection of free AI tools and resources.`
    : baseDescription;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
  };
}

export const revalidate = 3600; // Revalidate every hour

interface Tool {
  id: string;
  tool_name: string;
  slug: string;
  one_line_description: string;
  pricing_model: "Free" | "Freemium" | "Paid" | "Free Trial";
  url: string;
  logo?: string;
  category?: string | string[];
}

interface CategoryOption {
  value: string;
  label: string;
}

async function getFreeTools(): Promise<{
  tools: Tool[];
  categories: CategoryOption[];
}> {
  try {
    const { data: toolsData, error: toolsError } = await supabaseServer
      .from("tools_summary")
      .select(
        "id,tool_name,slug,one_line_description,pricing_model,url,logo,category"
      )
      .eq("pricing_model", "Free");

    if (toolsError) throw toolsError;

    const categorySet = new Set<string>();
    toolsData?.forEach((tool) => {
      const categories = tool.category;

      if (Array.isArray(categories)) {
        categories.forEach((cat) => {
          if (cat && typeof cat === "string") {
            categorySet.add(cat);
          }
        });
      } else if (typeof categories === "string" && categories) {
        categorySet.add(categories);
      }
    });

    const categoryList: CategoryOption[] = [
      { value: "all", label: "All Categories" },
      ...Array.from(categorySet).map((cat) => ({
        value: cat.toLowerCase().replace(/\s+/g, "-"),
        label: cat,
      })),
    ];

    return {
      tools: toolsData || [],
      categories: categoryList,
    };
  } catch (err) {
    console.error("Error fetching tools or categories:", err);
    return {
      tools: [],
      categories: [{ value: "all", label: "All Categories" }],
    };
  }
}

export default async function FreeToolsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string | string[] }>;
}) {
  const { tools, categories } = await getFreeTools();

  // FAQs for Free Tools page - SEO optimized
  const freeToolsFaqs = [
    {
      question: "What are completely free AI tools?",
      answer:
        "Completely free AI tools are artificial intelligence applications that provide functionality without requiring payment, subscriptions, or credit card information. These tools leverage AI technologies like machine learning, natural language processing, and computer vision to help users accomplish various tasks across different domains.",
    },
    {
      question: "How do free AI tools maintain quality without charging users?",
      answer:
        "Free AI tools maintain quality through various business models including open-source development, freemium offerings where basic features remain free, research project initiatives, and community-driven development. Many are supported by larger organizations or funded through grants and partnerships.",
    },
    {
      question: "What categories of free AI tools exist?",
      answer:
        "Free AI tools span numerous categories: text and content generation, code development and debugging, image creation and editing, data analysis and visualization, language translation, voice synthesis, chatbots and conversational AI, productivity automation, and educational learning assistants. Each category addresses specific user needs and workflows.",
    },
    {
      question: "What limitations should I expect with free AI tools?",
      answer:
        "Free AI tools may have constraints such as daily usage quotas, processing time limits, file size restrictions, watermarks on outputs, limited customization options, or basic support. These limitations help manage server costs while still providing valuable functionality for most users' needs.",
    },
    {
      question: "Can free AI tools be used for professional and commercial work?",
      answer:
        "Usage rights vary by tool and license. Many free AI tools permit commercial use under specific conditions, while others may restrict commercial applications or require attribution. Always review the terms of service and licensing agreements to understand permitted uses and any requirements.",
    },
    {
      question: "How should I evaluate and select free AI tools?",
      answer:
        "Evaluate free AI tools based on your specific requirements: functionality alignment, output quality, ease of use, reliability, privacy policies, community support, and documentation quality. Test multiple options with your actual use cases to determine which tools best meet your needs and workflow preferences.",
    },
    {
      question: "Are there free AI development tools for programmers?",
      answer:
        "Yes, numerous free AI-powered development tools exist including code completion engines, automated testing frameworks, code review assistants, documentation generators, bug detection systems, and API development aids. These tools integrate into existing development environments to enhance productivity and code quality.",
    },
    {
      question: "What should I consider regarding data privacy with free AI tools?",
      answer:
        "When using free AI tools, review their privacy policies to understand data handling practices, storage duration, sharing policies, and security measures. Consider the sensitivity of your data, whether information is stored or processed locally versus in the cloud, and what rights you have over your data.",
    },
  ];

  const sp = (await searchParams) || {};
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const initialPage = rawPage ? Math.max(parseInt(rawPage, 10) || 1, 1) : 1;

  return (
    <FreeToolsContent
      tools={tools}
      categories={categories}
      faqs={freeToolsFaqs}
      initialPage={initialPage}
      showDescription={initialPage === 1}
    />
  );
}
