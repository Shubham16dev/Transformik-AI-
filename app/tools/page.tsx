"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Define Tool type
interface Tool {
  id: string;
  name: string;
  slug: string;
  one_line_description: string;
  price: string;
  url: string;
  category: string | null;
}

// Price Filter Options
const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "Free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "freetrial", label: "Free Trial" },
  { value: "paid", label: "Paid" },
];

export default function AllToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch tools and categories
  useEffect(() => {
    async function fetchTools() {
      const { data, error } = (await supabase
        .from("tools")
        .select("id,name,slug,one_line_description,price,url,category")
        .order("name", { ascending: true })) as {
        data: Tool[] | null;
        error: any | null;
      };

      if (error) {
        console.error("Supabase Fetch Error:", error);
        return;
      }

      const fetchedTools = data || [];
      setTools(fetchedTools);
      setFilteredTools(fetchedTools);

      // Extract unique categories and sort alphabetically
      const uniqueCategories = Array.from(
        new Set(fetchedTools.map((t) => t.category).filter(Boolean) as string[])
      ).sort((a, b) => a.localeCompare(b));

      setCategories(uniqueCategories);
    }

    fetchTools();
  }, []);

  // Filter tools based on search, category, and price
  useEffect(() => {
    let filtered: Tool[] = tools;

    if (search) {
      filtered = filtered.filter((tool) =>
        tool.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      filtered = filtered.filter((tool) => tool.category === category);
    }

    if (priceFilter !== "all") {
      filtered = filtered.filter((tool) => tool.price === priceFilter);
    }

    setFilteredTools(filtered);
  }, [search, category, priceFilter, tools]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All AI Tools</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />

        {/* Category Dropdown */}
        <Select value={category} onValueChange={setCategory} className="w-full md:w-1/3">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="max-h-80 overflow-y-auto">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Dropdown */}
        <Select value={priceFilter} onValueChange={setPriceFilter} className="w-full md:w-1/3">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {PRICE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                category: tool.category || "Uncategorized",
              }}
            />
          ))
        ) : (
          <p className="text-gray-500">No tools found matching your filters.</p>
        )}
      </div>
    </div>
  );
}
