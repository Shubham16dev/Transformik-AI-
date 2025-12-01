// app/tools/category/[slug]/page.tsx
import { supabaseServer } from "@/utils/supabaseServer";
import { SupabaseCache } from "@/utils/supabaseOptimized";
import { ToolsContent } from "@/app/tools/ToolsContent";
import type { Metadata } from "next";

export const revalidate = 3600; // Cache for 1 hour instead of always fresh

// Helper function to get the actual category name from slug
async function getCategoryNameFromSlug(slug: string): Promise<string> {
  try {
    // First try to get from categories_details table if it exists
    const { data: categoryDetails } = await supabaseServer
      .from("categories_details")
      .select("name")
      .eq("slug", slug)
      .single();

    if (categoryDetails?.name) {
      return categoryDetails.name;
    }

    // Fallback: Fetch a sample of categories from tools (limit to reduce data transfer)
    const { data, error } = await supabaseServer
      .from("tools_summary")
      .select("category")
      .not("category", "is", null)
      .limit(500); // Limit to reduce data transfer

    if (error) throw error;

    // Collect unique category names
    const allCategories = new Set<string>();
    data?.forEach((tool) => {
      const categories = tool.category;
      if (Array.isArray(categories)) {
        categories.forEach((cat) => {
          if (cat && typeof cat === "string") {
            allCategories.add(cat);
          }
        });
      } else if (typeof categories === "string" && categories) {
        allCategories.add(categories);
      }
    });

    // Normalize slug for comparison
    const normalizeForComparison = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const normalizedSlug = normalizeForComparison(slug);

    // Find the category that matches the slug
    const matchingCategory = Array.from(allCategories).find(
      (cat) => normalizeForComparison(cat) === normalizedSlug
    );

    console.log(
      `Slug: "${slug}" - Normalized: "${normalizedSlug}" - Found: "${
        matchingCategory || "NOT FOUND"
      }"`
    );

    if (matchingCategory) {
      return matchingCategory;
    }

    // If no match found, return a fallback
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } catch (err) {
    console.error("Error finding category name from slug:", err);
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}

// Helper function to get random categories excluding the current category
async function getRandomCategories(
  excludeCategoryName: string,
  limit: number = 6
): Promise<{ name: string; slug: string; count: number }[]> {
  try {
    // Fetch all categories
    const { data: allCategories, error } = await supabaseServer
      .from("categories_details")
      .select("name, slug");

    if (error) throw error;

    // Fetch all tools to count tools per category
    // category can be string | string[] | null according to Tool definition
    let allToolsData: { category?: string | string[] | null }[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data: toolsData, error: toolsError } = await supabaseServer
        .from("tools_summary")
        .select("category")
        .range(from, from + batchSize - 1);

      if (toolsError) throw toolsError;

      if (toolsData && toolsData.length > 0) {
        allToolsData = [...allToolsData, ...toolsData];
        from += batchSize;
        hasMore = toolsData.length === batchSize;
      } else {
        hasMore = false;
      }
    }

    // Count tools for each category
    const categoryCountMap = new Map<string, number>();
    allToolsData.forEach((tool) => {
      const categories = tool.category;
      if (Array.isArray(categories)) {
        categories.forEach((cat) => {
          if (cat && typeof cat === "string") {
            const count = categoryCountMap.get(cat) || 0;
            categoryCountMap.set(cat, count + 1);
          }
        });
      } else if (typeof categories === "string" && categories) {
        const count = categoryCountMap.get(categories) || 0;
        categoryCountMap.set(categories, count + 1);
      }
    });

    // Filter out the excluded category
    const filteredCategories = allCategories.filter(
      (category) => category.name !== excludeCategoryName
    );

    // Shuffle the filtered categories array
    for (let i = filteredCategories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredCategories[i], filteredCategories[j]] = [
        filteredCategories[j],
        filteredCategories[i],
      ];
    }

    // Add the actual count for each category
    const categoriesWithCount = filteredCategories.map((category) => ({
      ...category,
      count: categoryCountMap.get(category.name) || 0,
    }));

    // Return the first `limit` categories
    return categoriesWithCount.slice(0, limit);
  } catch (err) {
    console.error("Error fetching random categories:", err);
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
  searchParams?: Promise<{
    page?: string | string[];
    search?: string | string[];
    price?: string | string[];
  }>;
}) {
  const { slug } = await params;
  const sp = (await searchParams) || {};

  // Extract query parameters
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const rawSearch = Array.isArray(sp.search) ? sp.search[0] : sp.search;
  const rawPrice = Array.isArray(sp.price) ? sp.price[0] : sp.price;

  const currentPage = rawPage ? Math.max(parseInt(rawPage, 10) || 1, 1) : 1;
  const searchQuery = rawSearch || "";
  const priceFilter = rawPrice || "all";

  // Fetch category metadata (meta_title, description, faqs) server-side from categories_details
  const { data: catMeta } = await supabaseServer
    .from("categories_details")
    .select("name, meta_title, description, faqs")
    .eq("slug", slug)
    .single();

  // Get the actual category name by matching slug with real category names
  const categoryName = catMeta?.name || (await getCategoryNameFromSlug(slug));

  // Fetch tools for this specific category with pagination (15 per page)
  const result = await SupabaseCache.getToolsByCategory({
    categoryName,
    page: currentPage,
    pageSize: 15,
  });

  // Get random categories excluding the current category
  const randomCategories = await getRandomCategories(categoryName, 6);

  // Get all categories for the filter
  const categories = await SupabaseCache.getUniqueCategories();

  return (
    <ToolsContent
      tools={result.tools}
      categories={categories}
      categorySlug={slug}
      categoryMeta={catMeta ?? null}
      initialPage={currentPage}
      similarCategories={randomCategories}
      totalPages={result.totalPages}
      totalTools={result.total}
      initialSearch={searchQuery}
      initialPriceFilter={priceFilter}
    />
  );
}
