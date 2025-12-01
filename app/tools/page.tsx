// app/tools/page.tsx
import { SupabaseCache } from "@/utils/supabaseOptimized";
import { ToolsContent } from "./ToolsContent";

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
  const canonicalUrl = `https://www.transformik.com/tools${
    currentPage > 1 ? `?page=${currentPage}` : ""
  }`;

  const baseTitle = "All AI Tools | Browse 10,000+ AI Tools - Transformik AI";
  const baseDescription =
    "Browse and discover all AI tools in our comprehensive directory. Find AI tools for writing, coding, marketing, design, and more. Updated daily.";

  const title =
    currentPage > 1 ? `${baseTitle} - Page ${currentPage}` : baseTitle;
  const description =
    currentPage > 1
      ? `Continue exploring AI tools for writing, coding, marketing, design, and more.`
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

export const revalidate = 3600; // Regenerate every hour (ISR)

// SEO-optimized FAQs for All AI Tools page
const allToolsFaqs = [
  {
    question: "What makes AI tools essential for modern businesses?",
    answer:
      "AI tools have become crucial for businesses to stay competitive by automating repetitive tasks, enhancing decision-making with data insights, improving customer experiences, and scaling operations efficiently. They help reduce operational costs while increasing productivity across departments like marketing, sales, customer service, and content creation.",
  },
  {
    question: "How do I get started with AI tools if I'm a complete beginner?",
    answer:
      "Begin with user-friendly tools that have intuitive interfaces and clear tutorials. Start with simple tasks like content generation or image editing before moving to complex automation. Take advantage of free trials, watch tutorial videos, and join community forums. Focus on learning one tool thoroughly before exploring others.",
  },
  {
    question: "What are the most popular categories of AI tools?",
    answer:
      "The most sought-after categories include generative AI for content and images, chatbots and virtual assistants, data analytics and visualization, marketing automation, code generation, language translation, voice synthesis, video editing, and workflow automation tools. Each category serves different business functions and user needs.",
  },
  {
    question: "How can AI tools improve my team's productivity?",
    answer:
      "AI tools boost productivity by automating routine tasks, providing intelligent suggestions, streamlining workflows, and reducing time spent on manual processes. They enable teams to focus on strategic work while handling data processing, content creation, customer interactions, and project management more efficiently.",
  },
  {
    question: "What security considerations should I have when using AI tools?",
    answer:
      "Always review data privacy policies, ensure tools comply with relevant regulations (GDPR, CCPA), use tools with proper encryption and security certifications. Avoid sharing sensitive company data with untested tools, implement access controls, and regularly audit tool permissions and data handling practices.",
  },
  {
    question: "How do I measure the ROI of implementing AI tools?",
    answer:
      "Track metrics like time saved, increased output quality, reduced error rates, cost savings from automation, and improved customer satisfaction. Compare productivity before and after implementation, monitor tool usage analytics, and calculate the value generated versus subscription or implementation costs.",
  },
  {
    question: "Can AI tools replace human workers entirely?",
    answer:
      "AI tools are designed to augment human capabilities rather than replace workers entirely. They excel at automating repetitive tasks and providing intelligent assistance, but human creativity, strategic thinking, emotional intelligence, and complex problem-solving remain irreplaceable. The goal is human-AI collaboration for enhanced productivity.",
  },
  {
    question: "What trends should I watch in the AI tools landscape?",
    answer:
      "Key trends include multimodal AI capabilities, improved integration ecosystems, industry-specific specialized tools, enhanced privacy and security features, no-code/low-code AI solutions, and more affordable pricing models. Stay updated on emerging technologies and how they might benefit your specific use cases.",
  },
];

async function getTools(
  page: number = 1,
  search: string = "",
  category: string = "all",
  priceFilter: string = "all"
) {
  try {
    // Use optimized filtered query instead of fetching all tools
    const result = await SupabaseCache.getFilteredTools({
      page,
      pageSize: 15,
      search,
      category,
      priceFilter,
    });

    console.log(
      `✓ Successfully loaded ${result.tools.length} tools (page ${page})`
    );
    return result;
  } catch (err) {
    console.error("Error fetching tools:", err);
    return {
      tools: [],
      total: 0,
      page: 1,
      pageSize: 15,
      totalPages: 0,
    };
  }
}

async function getCategories() {
  try {
    const categories = await SupabaseCache.getUniqueCategories();
    return categories;
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string | string[];
    search?: string | string[];
    category?: string | string[];
    price?: string | string[];
  }>;
}) {
  const sp = (await searchParams) || {};

  // Extract query parameters
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const rawSearch = Array.isArray(sp.search) ? sp.search[0] : sp.search;
  const rawCategory = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const rawPrice = Array.isArray(sp.price) ? sp.price[0] : sp.price;

  const currentPage = rawPage ? Math.max(parseInt(rawPage, 10) || 1, 1) : 1;
  const search = rawSearch || "";
  const category = rawCategory || "all";
  const priceFilter = rawPrice || "all";

  // Fetch only the data needed for current page and filters
  const result = await getTools(currentPage, search, category, priceFilter);
  const categories = await getCategories();

  return (
    <ToolsContent
      tools={result.tools}
      categories={categories}
      faqs={allToolsFaqs}
      showDescription={currentPage === 1}
      initialPage={currentPage}
      totalPages={result.totalPages}
      totalTools={result.total}
      initialSearch={search}
      initialCategory={category}
      initialPriceFilter={priceFilter}
    />
  );
}
