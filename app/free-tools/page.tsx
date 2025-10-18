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

  return {
    title: "Free AI Tools | Discover Best Free AI Tools - Transformik AI",
    description:
      "Explore our collection of completely free AI tools. Find free tools for writing, coding, design, marketing, and more. No credit card required.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Free AI Tools | Discover Best Free AI Tools - Transformik AI",
      description:
        "Explore our collection of completely free AI tools. Find free tools for writing, coding, design, marketing, and more. No credit card required.",
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
        "Completely free AI tools are artificial intelligence applications that require no payment, no credit card, and have no hidden charges. These tools offer core AI functionality at no cost, making advanced AI technology accessible to everyone from students to professionals.",
    },
    {
      question: "Are free AI tools good quality?",
      answer:
        "Yes, many free AI tools offer excellent quality and functionality. While some have limitations compared to paid versions, numerous free AI tools are developed by reputable companies and provide professional-grade features that are perfect for individual users, small projects, and learning purposes.",
    },
    {
      question: "What types of free AI tools are available?",
      answer:
        "Free AI tools span multiple categories including AI writing assistants, code generators, image creators, chatbots, content generators, data analysis tools, design assistants, marketing automation, SEO tools, and educational AI platforms. Each category offers specialized functionality for different use cases.",
    },
    {
      question: "Do free AI tools have usage limits?",
      answer:
        "While completely free AI tools don't require payment, some may have usage limits such as daily request quotas, file size restrictions, or feature limitations. However, these tools provide substantial value and functionality within their free tier, making them practical for regular use.",
    },
    {
      question: "Can I use free AI tools for commercial projects?",
      answer:
        "Most free AI tools allow commercial use, but it's important to check each tool's terms of service. Many free AI platforms permit commercial applications with proper attribution or within certain usage limits. Always review the specific licensing terms before using any free AI tool for business purposes.",
    },
    {
      question: "How do I choose the best free AI tool for my needs?",
      answer:
        "To choose the best free AI tool, first identify your specific needs (writing, coding, design, etc.), then compare tools based on features, user reviews, ease of use, and output quality. Try multiple tools to find which one best fits your workflow and delivers results that meet your requirements.",
    },
    {
      question: "Are there free AI tools for developers and programmers?",
      answer:
        "Yes, there are numerous free AI tools for developers including code completion assistants, bug detectors, code generators, API testing tools, and documentation generators. These tools help programmers write better code faster and are completely free to use for development projects.",
    },
    {
      question: "What's the catch with free AI tools?",
      answer:
        "There's typically no catch with genuinely free AI tools. Companies offer free tools to build user base, showcase technology, or as marketing for premium versions. Free tools provide real value and functionality. Just be aware of data privacy policies and understand what limitations exist compared to paid alternatives.",
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
    />
  );
}
