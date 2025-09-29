import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ToolCardProps {
  tool: {
    name: string;
    slug: string;
    description: string;
    price: string; // "Free", "Freemium", "Paid", "Free Trial"
    url: string;
    logo?: string;
    category?: string; // optional
  };
}

// Price capsule colors
function getPriceColor(price: string) {
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

// Category capsule color (placeholder)
function getCategoryColor(category?: string) {
  if (!category) return "bg-gray-200 text-gray-800";
  const colors: Record<string, string> = {
    AI: "bg-purple-100 text-purple-800",
    Productivity: "bg-indigo-100 text-indigo-800",
    Design: "bg-pink-100 text-pink-800",
    Marketing: "bg-orange-100 text-orange-800",
  };
  return colors[category] || "bg-gray-200 text-gray-800";
}

export function ToolCard({ tool }: ToolCardProps) {
  const logoHeight = 80; // px, adjust to make card more rectangular

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 rounded-xl border p-4 flex flex-col justify-between h-[180px] w-auto">
      {/* Top Row: Logo + Details */}
      <div className="flex gap-4 h-[80px]">
        {/* Logo */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {tool.logo ? (
            <Image
              src={tool.logo}
              alt=""
              width={96}
              height={96}
              className="object-contain"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg">
              <span className="text-gray-400 text-sm font-medium">No Logo</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between flex-grow h-full">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-1">
              <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
            </h3>
            <p className="text-gray-600 text-sm line-clamp-1">
              {tool.description.split(" ").slice(0, 5).join(" ")}
            </p>
          </div>
          {/* Capsules */}
          <div className="flex flex-wrap gap-2 mt-1">
            {tool.category && (
              <span
                className={`inline-block text-xs font-medium px-2 py-1  ${getCategoryColor(
                  tool.category
                )}`}
              >
                {tool.category}
              </span>
            )}
            <span
              className={`inline-block text-xs font-medium px-2 py-1  ${getPriceColor(
                tool.price
              )}`}
            >
              {tool.price}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Buttons */}
      <div className="flex gap-2 mt-2 justify-start">
        <Button
          asChild
          size="sm"
          className="px-4 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          <a href={tool.url} target="_blank" rel="noopener noreferrer">
            Visit Site
          </a>
        </Button>
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
