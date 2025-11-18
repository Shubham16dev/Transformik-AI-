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

  // Clear specific cache
  static clearCache(key: string) {
    cache.clear();
  }

  // Clear all cache
  static clearAllCache() {
    cache.clear();
  }
}
