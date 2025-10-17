// app/tools/category/[slug]/page.tsx
import { supabaseServer } from "@/utils/supabaseServer";
import { ToolsContent } from "@/app/tools/ToolsContent";
import type { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

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

async function getTools(): Promise<Tool[]> {
  try {
    const { data, error } = await supabaseServer
      .from("tools_summary")
      .select("*")
      .order("tool_name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("Error fetching tools:", err);
    return [];
  }
}

// Generate static paths at build time
export async function generateStaticParams() {
  const { data: categories } = await supabaseServer
    .from("categories_details")
    .select("slug");

  return (
    categories?.map((category) => ({
      slug: category.slug,
    })) || []
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await supabaseServer
    .from("categories_details")
    .select("meta_title, meta_description, description, name")
    .eq("slug", slug)
    .single();

  const categoryName = data?.name || slug.replace(/-/g, " ");
  const title = data?.meta_title || `${categoryName} AI Tools | Transformik AI`;
  const description =
    data?.meta_description ||
    `Browse ${categoryName} AI tools and resources. Find the best AI tools for ${categoryName.toLowerCase()}.`;

  if (!data) {
    return {
      title: `${categoryName} AI Tools | Transformik AI`,
      description: `Browse ${categoryName} AI tools and resources. Find the best AI tools for ${categoryName.toLowerCase()}.`,
      alternates: {
        canonical: `https://www.transformik.com/tools/category/${slug}`,
      },
    };
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.transformik.com/tools/category/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.transformik.com/tools/category/${slug}`,
    },
  };
}

export default async function ToolsByCategory({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string | string[] }>;
}) {
  const { slug } = await params;

  // Fetch category metadata (meta_title, description, faqs) server-side from categories_details
  const { data: catMeta } = await supabaseServer
    .from("categories_details")
    .select("name, meta_title, description, faqs")
    .eq("slug", slug)
    .single();

  // Fetch all tools server-side
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
      categorySlug={slug}
      categoryMeta={catMeta ?? null}
      initialPage={initialPage}
    />
  );
}
