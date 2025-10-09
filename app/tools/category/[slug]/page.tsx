// app/tools/category/[slug]/page.tsx
import { ToolsContent } from "@/app/tools/ToolsContent";

export default function ToolsByCategory({ params }: { params: { slug: string } }) {
  return <ToolsContent categorySlug={params.slug} />;
}
