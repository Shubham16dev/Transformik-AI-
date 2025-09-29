"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { ToolCard } from "@/components/tools/ToolCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Tool {
  id: string;
  name: string;
  slug: string;
  one_line_description: string;
  price: string;
  url: string;
  logo?: string;
  category?: string;
}

export default function FreeToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchFreeTools() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("tools")
          .select("id,name,slug,one_line_description,price,url,logo,category")
          .eq("price", "Free")
          .order("name", { ascending: true });

        if (error) throw error;

        setTools(data || []);
        setFilteredTools(data || []);
      } catch (err) {
        console.error("Error fetching free tools:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFreeTools();
  }, []);

  // Search filter
  useEffect(() => {
    if (!search) {
      setFilteredTools(tools);
    } else {
      const filtered = tools.filter((tool) =>
        tool.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTools(filtered);
    }
  }, [search, tools]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Free AI Tools</h1>
        <p className="text-gray-600">
          Explore all AI tools available for free to boost your workflow.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search Tools
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Search free tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Tools Grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading free tools...</p>
        </div>
      ) : filteredTools.length === 0 ? (
        <p className="text-gray-500">No free tools found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={{
                name: tool.name,
                slug: tool.slug,
                description: tool.one_line_description,
                price: tool.price,
                url: tool.url,
                // logo: tool.logo,
                category: tool.category,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
