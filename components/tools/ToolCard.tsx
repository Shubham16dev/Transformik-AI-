import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Bookmark } from "lucide-react";

interface ToolCardProps {
  tool: {
    name: string;
    slug: string;
    description: string;
    price: string;
    url: string;
    logo?: string;
  };
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 rounded-xl border p-3">
      <CardContent className="flex items-center gap-4 p-0">
        {/* Left: Logo */}
        {tool.logo && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={tool.logo}
              alt={`${tool.name} logo`}
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Middle: Text content */}
        <div className="flex flex-col flex-grow">
          <h3 className="font-semibold text-lg">
            <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
          </h3>
          <p className="text-gray-600 text-sm">{tool.description}</p>
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-md mt-2 w-fit">
            {tool.price}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col items-end gap-2">
          <Button asChild size="sm" variant="outline">
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              Visit Site
            </a>
          </Button>
          <Button>
            <Link href={`/tools/${tool.slug}`}>View more</Link>
          </Button>
          {/* <Link href={`/tools/${tool.slug}`}>
            <Bookmark className="w-5 h-5 text-blue-500 hover:text-blue-600" />
          </Link> */}
        </div>
      </CardContent>
    </Card>
  );
}
