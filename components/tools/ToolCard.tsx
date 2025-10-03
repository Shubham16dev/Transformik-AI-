"use client"; // Required for ShadCN Card

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolLogo } from "@/components/tools/ToolLogo";

interface ToolCardProps {
  tool: {
    tool_name: string;
    slug: string;
    one_line_description: string;
    pricing_model?: "Free" | "Freemium" | "Paid" | "Free Trial";
    url?: string;
    logo?: string; // full public URL
    category?: string;
  };
}

function getPriceColor(price?: string) {
  if (!price) return "bg-gray-100 text-gray-800";
  switch (price.toLowerCase()) {
    case "free":
      return "bg-green-100 text-green-800";
    case "freemium":
      return "bg-blue-100 text-blue-800";
    case "paid":
      return "bg-yellow-100 text-yellow-800";
    case "free trial":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getCategoryColor(category?: string) {
  const colors: Record<string, string> = {
    "Writing & Editing": "bg-purple-100 text-purple-800",
    "Image Generation & Editing": "bg-pink-100 text-pink-800",
    "Image Analysis": "bg-indigo-100 text-indigo-800",
    "Music & Audio": "bg-green-100 text-green-800",
    "Voice Generation & Conversion": "bg-teal-100 text-teal-800",
    "Art & Creative Design": "bg-red-100 text-red-800",
    "Social Media": "bg-yellow-100 text-yellow-800",
    "AI Detection & Anti-Detection": "bg-gray-100 text-gray-800",
    "Coding & Development": "bg-blue-200 text-blue-900",
    "Video & Animation": "bg-pink-200 text-pink-900",
    "Daily Life": "bg-green-200 text-green-900",
    "Legal & Finance": "bg-indigo-200 text-indigo-900",
    "Business Management": "bg-orange-100 text-orange-800",
    "Marketing & Advertising": "bg-orange-200 text-orange-900",
    "Health & Wellness": "bg-red-200 text-red-900",
    "Business Research": "bg-teal-200 text-teal-900",
    "Education & Translation": "bg-purple-200 text-purple-900",
    "Chatbots & Virtual Companions": "bg-purple-300 text-purple-900",
    "Interior & Architectural Design": "bg-pink-300 text-pink-900",
    "Office & Productivity": "bg-indigo-300 text-indigo-900",
    "Research & Data Analysis": "bg-gray-300 text-gray-900",
    Other: "bg-gray-200 text-gray-800",
  };
  return category ? colors[category] ?? colors.Other : colors.Other;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 rounded-xl border p-4 flex flex-col justify-between h-[180px] w-auto">
      <div className="flex gap-4 h-[80px]">
        {/* Logo using ToolLogo */}
        <ToolLogo src={tool.logo} alt={`${tool.tool_name} logo`} />

        {/* Details */}
        <div className="flex flex-col justify-between flex-grow h-full">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-1">
              <Link href={`/tools/${tool.slug}`}>{tool.tool_name}</Link>
            </h3>
            <p className="text-gray-600 text-sm line-clamp-1">
              {tool.one_line_description}
            </p>
          </div>
          <div className="flex gap-2 mt-1 overflow-hidden">
            {tool.category && (
              <span
                className={`inline-block text-xs font-medium px-2 py-1 ${getCategoryColor(
                  tool.category
                )}`}
              >
                {tool.category}
              </span>
            )}
            {/* <span
              className={`inline-block text-xs font-medium px-2 py-1 ${getPriceColor(
                tool.pricing_model
              )}`}
            >
              {tool.pricing_model ?? "Unknown"}
            </span> */}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-2 justify-start">
        {tool.url && (
          <Button
            asChild
            size="sm"
            className="px-4 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              Visit Site
            </a>
          </Button>
        )}
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
