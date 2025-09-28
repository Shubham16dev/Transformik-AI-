import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturedToolCardProps {
  tool: {
    name: string;
    slug: string;
    description: string;
    price: string;
  };
}

export function FeaturedToolCard({ tool }: FeaturedToolCardProps) {
  return (
    <Card className="bg-blue-50 border-blue-300 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-2xl font-bold">{tool.name}</h2>
        <p className="text-gray-700">{tool.description}</p>
        <span className="font-medium text-gray-600">{tool.price}</span>
        <Link
          href={`/tools/${tool.slug}`}
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Tool
        </Link>
      </CardContent>
    </Card>
  );
}
