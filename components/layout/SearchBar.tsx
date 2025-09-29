"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { Input } from "@/components/ui/input";

interface Tool {
  id: string;
  name: string;
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

  const filteredTools = tools.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
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
      const { data: toolData } = await supabase
        .from("tools")
        .select("id, name, slug, one_line_description")
        .ilike("name", `%${query}%`)
        .limit(5);

      const { data: blogData } = await supabase
        .from("blogs")
        .select("id, title, slug, excerpt")
        .ilike("title", `%${query}%`)
        .limit(5);

      setTools(toolData || []);
      setBlogs(blogData || []);
    };

    const debounce = setTimeout(fetchData, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative max-w-2xl mx-auto mt-8">
      {/* Simplified Search Input */}
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
          className="flex-1 border-0 focus:ring-0 focus-visible:ring-0 bg-transparent text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Dropdown results remain the same */}
      {showDropdown && query && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-96 overflow-y-auto z-50 p-4 space-y-4">
          {/* Tools Section */}
          {filteredTools.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-3">
              <h2 className="text-gray-900 font-semibold mb-2">Tools</h2>
              <div className="space-y-2">
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="block p-2 rounded hover:bg-purple-100 transition"
                    onClick={() => setQuery("")}
                  >
                    <div className="font-medium text-gray-900">{tool.name}</div>
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
                    href={`/blogs/${blog.slug}`}
                    className="block p-2 rounded hover:bg-yellow-100 transition"
                    onClick={() => setQuery("")}
                  >
                    <div className="font-medium text-gray-900">{blog.title}</div>
                    <div className="text-gray-600 text-sm truncate">{blog.excerpt || ""}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredTools.length === 0 && filteredBlogs.length === 0 && (
            <div className="text-gray-500 text-sm text-center">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
}
