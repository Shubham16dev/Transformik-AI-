// app/tools/page.tsx
import { supabaseServer } from "@/utils/supabaseServer";
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

export const revalidate = 0; // Always fetch fresh content for tools

interface Tool {
  id: string;
  tool_name: string;
  slug: string;
  one_line_description: string;
  pricing_model: string;
  url?: string;
  category?: string | string[] | null;
  logo?: string | null;
}

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

async function getTools(): Promise<Tool[]> {
  try {
    let allTools: Tool[] = [];
    let from = 0;
    const batchSize = 1000; // Supabase default limit
    let hasMore = true;

    // Fetch all tools in batches to handle large datasets
    while (hasMore) {
      const { data, error } = await supabaseServer
        .from("tools_summary")
        .select("*")
        .order("tool_name", { ascending: true })
        .range(from, from + batchSize - 1);

      if (error) {
        console.error("Supabase error fetching tools:", error);
        throw error;
      }

      if (data && data.length > 0) {
        allTools = [...allTools, ...data];
        from += batchSize;
        hasMore = data.length === batchSize;
      } else {
        hasMore = false;
      }
    }

    // console.log(`✓ Successfully fetched ${allTools.length} tools from Supabase`);
    return allTools;
  } catch (err) {
    console.error("Error fetching tools:", err);
    return [];
  }
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string | string[] }>;
}) {
  const tools = await getTools();

  // Extract unique categories
  const allCategories: string[] = [];
  tools.forEach((tool) => {
    const toolCategories = tool.category;
    if (Array.isArray(toolCategories)) {
      toolCategories.forEach((cat) => cat && allCategories.push(cat));
    } else if (typeof toolCategories === "string" && toolCategories) {
      allCategories.push(toolCategories);
    }
  });
  const categories = Array.from(new Set(allCategories)).sort();

  const sp = (await searchParams) || {};
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const initialPage = rawPage ? Math.max(parseInt(rawPage, 10) || 1, 1) : 1;

  return (
    <ToolsContent
      tools={tools}
      categories={categories}
      faqs={allToolsFaqs}
      showDescription={initialPage === 1}
      initialPage={initialPage}
    />
  );
}
