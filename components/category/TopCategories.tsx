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
        const allCategories: string[] = [];

        data.forEach((tool) => {
          const categories = tool.category;

          if (Array.isArray(categories)) {
            categories.forEach((cat) => {
              if (cat && typeof cat === "string") {
                allCategories.push(cat);
              }
            });
          } else if (typeof categories === "string" && categories) {
            allCategories.push(categories);
          }
        });

        const unique = Array.from(new Set(allCategories));
        setCategories(unique);
      }
    };

    fetchCategories();
  }, []);

  // Convert category names into URL-friendly slugs
  const generateSlug = (category: string) =>
    category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  return (
    <div>
      {" "}
      <h3 className="font-semibold text-xl mb-3 text-gray-900">
        Top AI Categories{" "}
      </h3>{" "}
      <ul className="space-y-2 text-gray-700">
        {categories.slice(0, limit).map((category) => {
          const slug = generateSlug(category);
          return (
            <li key={category}>
              <Link
                href={`/tools/category/${slug}`}
                className="relative hover:text-gray-900 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-purple-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >
                {category}{" "}
              </Link>{" "}
            </li>
          );
        })}{" "}
        <li>
          {" "}
          <Link
            href="/tools/category"
            className="relative hover:text-gray-900 transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-purple-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
          >
            All Categories →{" "}
          </Link>{" "}
        </li>{" "}
      </ul>{" "}
    </div>
  );
}
