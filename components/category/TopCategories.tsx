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
        const unique = Array.from(new Set(data.map((c) => c.category).filter(Boolean)));
        setCategories(unique);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Top AI Categories</h3>
      <ul className="space-y-2">
        {categories.slice(0, limit).map((category) => (
          <li key={category}>
            <Link
              href={`/tools?category=${encodeURIComponent(category)}`}
              className="text-sm text-blue-600 hover:underline block"
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <Link
          href="/categories"
          className="text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          View More Categories →
        </Link>
      </div>
    </div>
  );
}
