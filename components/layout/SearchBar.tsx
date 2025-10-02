"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Tool {
  id: string;
  tool_name: string;
  slug: string;
  one_line_description?: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTools = tools.filter((t) =>
    t.tool_name.toLowerCase().includes(query.toLowerCase())
  );
  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!query) {
      setTools([]);
      setBlogs([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: toolData } = await supabase
          .from("tools_summary")
          .select("id, tool_name, slug, one_line_description")
          .ilike("tool_name", `%${query}%`)
          .limit(5);

        const { data: blogData } = await supabase
          .from("blogs_summary")
          .select("id, title, slug, excerpt")
          .ilike("title", `%${query}%`)
          .limit(5);

        setTools(toolData || []);
        setBlogs(blogData || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchData, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative max-w-2xl mx-auto mt-8">
      {/* Search Input */}
      <div className="flex items-center bg-gray-100 rounded-full shadow-sm px-4 py-2 border border-gray-300 hover:border-gray-400 transition">
        <FiSearch className="text-gray-500 w-5 h-5 mr-3" />
        <Input
          type="text"
          placeholder="Search AI tools or blogs..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          aria-expanded={showDropdown}
          aria-controls="search-dropdown"
          className="flex-1 border-0 focus:ring-0 focus-visible:ring-0 bg-transparent text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && query && (
        <div
          id="search-dropdown"
          role="listbox"
          className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-96 overflow-y-auto z-50 p-4 space-y-4"
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <>
              {/* Tools Section */}
              {filteredTools.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <h2 className="text-gray-900 font-semibold mb-2">Tools</h2>
                  <div className="space-y-2">
                    {filteredTools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.slug}`}
                        role="option"
                        className="block p-2 rounded hover:bg-purple-100 transition"
                        onClick={() => setQuery("")}
                      >
                        <div className="font-medium text-gray-900">{tool.tool_name}</div>
                        <div className="text-gray-600 text-sm truncate">
                          {tool.one_line_description || ""}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Blogs Section */}
              {filteredBlogs.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-3">
                  <h2 className="text-gray-900 font-semibold mb-2">Blogs</h2>
                  <div className="space-y-2">
                    {filteredBlogs.map((blog) => (
                      <Link
                        key={blog.id}
                        href={`/blog/${blog.slug}`}
                        role="option"
                        className="block p-2 rounded hover:bg-yellow-100 transition"
                        onClick={() => setQuery("")}
                      >
                        <div className="font-medium text-gray-900">{blog.title}</div>
                        <div className="text-gray-600 text-sm truncate">
                          {blog.excerpt || ""}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredTools.length === 0 && filteredBlogs.length === 0 && (
                <div className="text-gray-500 text-sm text-center">No results found.</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
