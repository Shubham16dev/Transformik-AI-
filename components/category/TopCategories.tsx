"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

interface TopCategoriesProps {
  limit?: number;
}

export function TopCategories({ limit = 6 }: TopCategoriesProps) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("tools_summary")
        .select("category");

      if (!error && data) {
        const unique = Array.from(
          new Set(data.map((c) => c.category).filter(Boolean))
        );
        setCategories(unique);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h3 className="font-semibold text-xl mb-3 text-gray-900">Top AI Categories</h3>
      <ul className="space-y-2 text-gray-700">
        {categories.slice(0, limit).map((category) => (
          <li key={category}>
            <Link
              href={`/tools?category=${encodeURIComponent(category)}`}
              className="relative hover:text-gray-900 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-purple-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
            >
              {category}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/categories"
              className="relative hover:text-gray-900 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-purple-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
          >
            All Categories →
          </Link>
        </li>
      </ul>
    </div>
  );
}
