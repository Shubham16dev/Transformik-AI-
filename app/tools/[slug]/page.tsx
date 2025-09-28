import { supabase } from "@/utils/supabase";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function ToolDetailPage({ params }: { params: { slug: string } }) {
  const { data: toolData, error } = await supabase
    .from("tools")
    .select(`
      id,
      name,
      slug,
      one_line_description,
      price,
      url
    `)
    .eq("slug", params.slug)
    .single();

  if (error || !toolData) return notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{toolData.name}</h1>
      <p className="text-gray-700">{toolData.one_line_description}</p>

      <p className="font-semibold">Price: {toolData.price}</p>

      <div className="flex gap-4 mt-4">
        <Button>
          <a href={`/tools/${toolData.slug}`}>Details Page</a>
        </Button>
        <Button variant="outline">
          <a href={toolData.url} target="_blank" rel="noopener noreferrer">
            Visit Tool
          </a>
        </Button>
      </div>
    </div>
  );
}
