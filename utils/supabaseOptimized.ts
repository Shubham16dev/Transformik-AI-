// utils/supabaseOptimized.ts - Cached Supabase queries
import { supabaseServer } from "./supabaseServer";
import { supabase } from "./supabase";
import { cache } from "@/lib/cache";

// Server-side cached queries
export class SupabaseCache {
  // Get all tools with caching
  static async getAllTools() {
    const cacheKey = "all_tools";
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log("✓ Tools served from cache");
      return cached;
    }

    try {
      let allTools: any[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabaseServer
          .from("tools_summary")
          .select("*")
          .order("tool_name", { ascending: true })
          .range(from, from + batchSize - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allTools = [...allTools, ...data];
          from += batchSize;
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      // Cache for 1 hour
      cache.set(cacheKey, allTools, 60);
      console.log(`✓ Cached ${allTools.length} tools`);
      return allTools;
    } catch (error) {
      console.error("Error fetching tools:", error);
      return [];
    }
  }

  // Get all blogs with caching
  static async getAllBlogs() {
    const cacheKey = "all_blogs";
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log("✓ Blogs served from cache");
      return cached;
    }

    try {
      const { data, error } = await supabaseServer
        .from("blogs_summary")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Cache for 1 hour
      cache.set(cacheKey, data || [], 60);
      console.log(`✓ Cached ${data?.length || 0} blogs`);
      return data || [];
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }
  }

  // Get latest tools with caching
  static async getLatestTools(limit = 6) {
    const cacheKey = `latest_tools_${limit}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log("✓ Latest tools served from cache");
      return cached;
    }

    try {
      const { data, error } = await supabaseServer
        .from("tools_summary")
        .select(
          "id, tool_name, slug, one_line_description, pricing_model, url, logo, category"
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Cache for 1 hour (same as other data for consistency)
      cache.set(cacheKey, data || [], 60);
      console.log(`✓ Cached ${data?.length || 0} latest tools`);
      return data || [];
    } catch (error) {
      console.error("Error fetching latest tools:", error);
      return [];
    }
  }

  // Get latest blogs with caching
  static async getLatestBlogs(limit = 5) {
    const cacheKey = `latest_blogs_${limit}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log("✓ Latest blogs served from cache");
      return cached;
    }

    try {
      const { data, error } = await supabaseServer
        .from("blogs_summary")
        .select("id, title, slug, excerpt, featured_image")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Cache for 1 hour
      cache.set(cacheKey, data || [], 60);
      console.log(`✓ Cached ${data?.length || 0} latest blogs`);
      return data || [];
    } catch (error) {
      console.error("Error fetching latest blogs:", error);
      return [];
    }
  }

  // Get sitemap data with caching
  static async getSitemapData() {
    const cacheKey = "sitemap_data";
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log("✓ Sitemap data served from cache");
      return cached;
    }

    try {
      console.log("Starting to fetch sitemap data...");

      // Fetch categories efficiently
      let allCategoriesData: any[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabaseServer
          .from("tools_summary")
          .select("category")
          .not("category", "is", null)
          .range(from, from + batchSize - 1);

        if (error) break;

        if (data && data.length > 0) {
          allCategoriesData = [...allCategoriesData, ...data];
          from += batchSize;
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      // Extract unique categories
      const allCategories: string[] = [];
      allCategoriesData.forEach((item) => {
        if (item.category) {
          if (Array.isArray(item.category)) {
            allCategories.push(...item.category);
          } else if (typeof item.category === "string") {
            allCategories.push(item.category);
          }
        }
      });

      const uniqueCategories = Array.from(new Set(allCategories))
        .filter((category) => category && category.trim())
        .map((category) =>
          category
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        );

      // Fetch blogs
      const { data: blogs, error: blogsError } = await supabaseServer
        .from("blogs_summary")
        .select("slug, created_at")
        .order("created_at", { ascending: false });

      // Fetch all tools for sitemap
      let allTools: any[] = [];
      from = 0;
      hasMore = true;

      while (hasMore) {
        const { data, error } = await supabaseServer
          .from("tools_summary")
          .select("slug, created_at")
          .order("created_at", { ascending: false })
          .range(from, from + batchSize - 1);

        if (error) break;

        if (data && data.length > 0) {
          allTools = [...allTools, ...data];
          from += batchSize;
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      const sitemapData = {
        categories: uniqueCategories,
        blogs: blogs || [],
        tools: allTools,
      };

      // Cache for 1 hour (consistent with other caching)
      cache.set(cacheKey, sitemapData, 60);
      console.log(
        `✓ Cached sitemap data: ${uniqueCategories.length} categories, ${
          blogs?.length || 0
        } blogs, ${allTools.length} tools`
      );

      return sitemapData;
    } catch (error) {
      console.error("Error fetching sitemap data:", error);
      return { categories: [], blogs: [], tools: [] };
    }
  }

  // Get paginated and filtered tools (NEW - for performance optimization)
  static async getFilteredTools({
    page = 1,
    pageSize = 15,
    search = "",
    category = "all",
    priceFilter = "all",
  }: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    priceFilter?: string;
  }) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Build the query
      let query = supabaseServer
        .from("tools_summary")
        .select("*", { count: "exact" })
        .order("tool_name", { ascending: true });

      // Apply search filter
      if (search) {
        query = query.ilike("tool_name", `%${search}%`);
      }

      // Apply category filter
      if (category && category !== "all") {
        query = query.contains("category", [category]);
      }

      // Apply price filter
      if (priceFilter && priceFilter !== "all") {
        query = query.eq("pricing_model", priceFilter);
      }

      // Apply pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Deduplicate by ID to prevent duplicate key errors
      const uniqueTools = data
        ? Array.from(new Map(data.map((tool) => [tool.id, tool])).values())
        : [];

      console.log(
        `✓ Fetched ${uniqueTools.length} tools (page ${page}, total: ${count})`
      );

      return {
        tools: uniqueTools,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    } catch (error) {
      console.error("Error fetching filtered tools:", error);
      return {
        tools: [],
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0,
      };
    }
  }

  // Get tools by category with pagination (optimized)
  static async getToolsByCategory({
    categoryName,
    page = 1,
    pageSize = 15,
  }: {
    categoryName: string;
    page?: number;
    pageSize?: number;
  }) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Query with database-level filtering
      const { data, error, count } = await supabaseServer
        .from("tools_summary")
        .select("*", { count: "exact" })
        .contains("category", [categoryName])
        .order("tool_name", { ascending: true })
        .range(from, to);

      if (error) throw error;

      console.log(
        `✓ Fetched ${
          data?.length || 0
        } tools for category "${categoryName}" (page ${page}, total: ${count})`
      );

      return {
        tools: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    } catch (error) {
      console.error("Error fetching tools by category:", error);
      return {
        tools: [],
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0,
      };
    }
  }

  // Get unique categories (optimized with caching)
  static async getUniqueCategories(): Promise<string[]> {
    const cacheKey = "unique_categories";
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log("✓ Categories served from cache");
      return cached as string[];
    }

    try {
      // Fetch only category column
      let allCategoriesData: any[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabaseServer
          .from("tools_summary")
          .select("category")
          .not("category", "is", null)
          .range(from, from + batchSize - 1);

        if (error) break;

        if (data && data.length > 0) {
          allCategoriesData = [...allCategoriesData, ...data];
          from += batchSize;
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      // Extract and deduplicate categories
      const allCategories: string[] = [];
      allCategoriesData.forEach((item) => {
        if (item.category) {
          if (Array.isArray(item.category)) {
            allCategories.push(...item.category.filter(Boolean));
          } else if (typeof item.category === "string") {
            allCategories.push(item.category);
          }
        }
      });

      const uniqueCategories = Array.from(new Set(allCategories))
        .filter((cat) => cat && cat.trim())
        .sort();

      // Cache for 1 hour
      cache.set(cacheKey, uniqueCategories, 60);
      console.log(`✓ Cached ${uniqueCategories.length} unique categories`);

      return uniqueCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  // Get filtered free tools with pagination (NEW - for performance)
  static async getFilteredFreeTools({
    page = 1,
    pageSize = 9,
    search = "",
    category = "all",
    sortMode = "alpha-asc",
  }: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    sortMode?: string;
  }) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Build the query
      let query = supabaseServer
        .from("tools_summary")
        .select(
          "id,tool_name,slug,one_line_description,pricing_model,url,logo,category",
          { count: "exact" }
        )
        .eq("pricing_model", "Free");

      // Apply search filter
      if (search) {
        query = query.ilike("tool_name", `%${search}%`);
      }

      // Apply category filter
      if (category && category !== "all") {
        query = query.contains("category", [category]);
      }

      // Apply sorting
      if (sortMode === "alpha-desc") {
        query = query.order("tool_name", { ascending: false });
      } else {
        query = query.order("tool_name", { ascending: true });
      }

      // Apply pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Deduplicate by ID
      const uniqueTools = data
        ? Array.from(new Map(data.map((tool) => [tool.id, tool])).values())
        : [];

      console.log(
        `✓ Fetched ${uniqueTools.length} free tools (page ${page}, total: ${count})`
      );

      return {
        tools: uniqueTools,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    } catch (error) {
      console.error("Error fetching free tools:", error);
      return {
        tools: [],
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0,
      };
    }
  }

  // Get free tool categories (optimized with caching)
  static async getFreeToolCategories(): Promise<string[]> {
    const cacheKey = "free_tool_categories";
    const cached = cache.get(cacheKey);

    if (cached) {
      console.log("✓ Free tool categories served from cache");
      return cached as string[];
    }

    try {
      const { data, error } = await supabaseServer
        .from("tools_summary")
        .select("category")
        .eq("pricing_model", "Free")
        .not("category", "is", null);

      if (error) throw error;

      // Extract and deduplicate categories
      const allCategories: string[] = [];
      data?.forEach((item) => {
        if (item.category) {
          if (Array.isArray(item.category)) {
            allCategories.push(...item.category.filter(Boolean));
          } else if (typeof item.category === "string") {
            allCategories.push(item.category);
          }
        }
      });

      const uniqueCategories = Array.from(new Set(allCategories))
        .filter((cat) => cat && cat.trim())
        .sort();

      // Cache for 1 hour
      cache.set(cacheKey, uniqueCategories, 60);
      console.log(`✓ Cached ${uniqueCategories.length} free tool categories`);

      return uniqueCategories;
    } catch (error) {
      console.error("Error fetching free tool categories:", error);
      return [];
    }
  }

  // Get filtered blogs with pagination (NEW - for performance)
  static async getFilteredBlogs({
    page = 1,
    pageSize = 8,
    sortOption = "date-desc",
  }: {
    page?: number;
    pageSize?: number;
    sortOption?: string;
  }) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Build the query
      let query = supabaseServer
        .from("blogs_summary")
        .select("*", { count: "exact" });

      // Apply sorting
      if (sortOption === "date-asc") {
        query = query.order("created_at", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      // Apply pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      console.log(
        `✓ Fetched ${data?.length || 0} blogs (page ${page}, total: ${count})`
      );

      return {
        blogs: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return {
        blogs: [],
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0,
      };
    }
  }

  // Clear specific cache
  static clearCache(key: string) {
    cache.clear();
  }

  // Clear all cache
  static clearAllCache() {
    cache.clear();
  }
}
