// app/tools/category/[slug]/page.tsx
import { supabase } from "@/utils/supabase";
import { ToolsContent } from "@/app/tools/ToolsContent";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await supabase
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch category metadata (meta_title, description, faqs) server-side from categories_details
  const { data: catMeta } = await supabase
    .from("categories_details")
    .select("name, meta_title, description, faqs")
    .eq("slug", slug)
    .single();

  return <ToolsContent categorySlug={slug} categoryMeta={catMeta ?? null} />;
}
