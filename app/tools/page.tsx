"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard"; 

// Define a type for the tool objects
interface Tool {
  id: string;
  name: string;
  slug: string;
  one_line_description: string;
  price: string; // Using string for flexibility with all price types
  url: string;
  // logo: string | null;
  category: string | null;
}

// Hardcoded Price Filter Options (based on your 'tools_price_check' constraint)
const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free/Freemium/Trial" },
  { value: "paid", label: "Strictly Paid" },
];

// Price values considered "free" for the filter
const FREE_TIERS = ['Free', 'freemium', 'freeai', 'freetrial'];


export default function AllToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]); // Unique categories for dropdown

  // 1. Fetch data and set unique categories for the dropdown
  useEffect(() => {
    async function fetchTools() {
      // Fetch ALL tool data
      const { data, error } = await supabase
        .from("tools")
        .select("id,name,slug,one_line_description,price,url,logo,category")
        .order("name", { ascending: true }) as { data: Tool[] | null, error: any | null };

      if (error) {
        console.error("Supabase Fetch Error:", error);
        return;
      }

      const fetchedTools = data || [];
      setTools(fetchedTools);
      setFilteredTools(fetchedTools);

      // Extract unique categories for the dropdown options
      const uniqueCategories = Array.from(
        new Set(fetchedTools.map((t) => t.category).filter(Boolean) as string[])
      );
      setCategories(uniqueCategories);
    }

    fetchTools();
  }, []);

  // 2. Filter tools whenever search, category, or price changes
  useEffect(() => {
    let filtered: Tool[] = tools;

    // A. Search Filter
    if (search) {
      filtered = filtered.filter((tool) =>
        tool.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // B. Category Filter
    if (category !== "all") {
      filtered = filtered.filter((tool) => tool.category === category);
    }

    // C. Price Filter (Uses the defined FREE_TIERS and checks for 'paid')
    if (priceFilter === "free") {
      filtered = filtered.filter((tool) => FREE_TIERS.includes(tool.price));
    } else if (priceFilter === "paid") {
      filtered = filtered.filter((tool) => tool.price === 'paid');
    }

    setFilteredTools(filtered);
  }, [search, category, priceFilter, tools]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All AI Tools</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border rounded px-3 py-2"
        />

        {/* Category Dropdown (Uses fetched unique categories) */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/3 border rounded px-3 py-2"
        >
          <option value="all">All Categories</option>
          {/* Mapping over the fetched categories array */}
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Price Dropdown (Uses hardcoded PRICE_OPTIONS) */}
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="w-full md:w-1/3 border rounded px-3 py-2"
        >
          {/* Mapping over the hardcoded price options array */}
          {PRICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={{
                name: tool.name,
                slug: tool.slug,
                description: tool.one_line_description,
                price: tool.price,
                url: tool.url,
                // logo: tool.logo,
                category: tool.category || "Uncategorized",
              }}
            />
          ))
        ) : (
          <p>No tools found matching your filters.</p>
        )}
      </div>
    </div>
  );
}