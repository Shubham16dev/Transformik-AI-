"use client"; // Required for ShadCN Card

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { ExternalLink } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";

interface ToolCardProps {
  tool: {
    tool_name: string;
    slug: string;
    one_line_description: string;
    pricing_model?: "Free" | "Freemium" | "Paid" | "Free Trial";
    url?: string;
    logo?: string; // full public URL
    category?: string | string[];
  };
}

export function ToolCard({ tool }: ToolCardProps) {
  // Ensure category is an array
  const categories = Array.isArray(tool.category)
    ? tool.category
    : tool.category
    ? [tool.category]
    : [];

  // Display first 2 categories and count remaining
  const displayCategories = categories.slice(0, 2);
  const remainingCount = categories.length - displayCategories.length;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 rounded-xl border p-4 flex flex-col justify-between w-auto">
      <div className="flex gap-4">
        {/* Logo */}
        <ToolLogo src={tool.logo} alt={`${tool.tool_name} logo`} />

        {/* Details */}
        <div className="flex flex-col justify-between flex-grow">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-1 flex-grow">
                <Link href={`/tools/${tool.slug}`}>{tool.tool_name}</Link>
              </h3>
              {tool.url && (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-1 text-gray-500 hover:text-blue-600 transition-colors flex-shrink-0"
                  title="Visit website"
                >
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-1">
              {tool.one_line_description}
            </p>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {displayCategories.map((cat, idx) => (
              <CategoryBadge key={idx} category={cat} />
            ))}
            {remainingCount > 0 && (
              <span className="inline-block text-xs font-medium px-2 py-1 bg-gray-100 text-gray-800 border border-gray-200 rounded-full">
                +{remainingCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-2 justify-start">
        <Button
          asChild
          size="sm"
          className="px-4 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          <Link href={`/tools/${tool.slug}`}>View More</Link>
        </Button>
      </div>
    </Card>
  );
}
