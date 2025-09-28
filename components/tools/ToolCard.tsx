import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ToolCardProps {
  tool: {
    name: string;
    slug: string;
    description: string;
    price: string;
    url: string; // actual tool
    logo?: string; // logo URL (optional)
  };
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
      <CardContent className="flex flex-col h-full p-4">
        {/* Top section (Logo + Name + Description) */}
        <div className="flex flex-col gap-2 flex-grow">
          {tool.logo && (
            <div className="relative w-12 h-12">
              <Image
                src={tool.logo}
                alt={`${tool.name} logo`}
                fill
                className="object-contain rounded-md"
              />
            </div>
          )}

          <h3 className="font-semibold text-lg">
            <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3">
            {tool.description}
          </p>

          <span className="text-xs text-gray-500">{tool.price}</span>
        </div>

        {/* Bottom buttons (always aligned) */}
        <div className="flex gap-2 mt-4">
          <Button asChild size="sm">
            <Link href={`/tools/${tool.slug}`}>Details</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              Visit Tool
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
