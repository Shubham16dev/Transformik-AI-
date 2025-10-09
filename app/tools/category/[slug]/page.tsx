// app/tools/category/[slug]/page.tsx
import { ToolsContent } from "@/app/tools/ToolsContent";

export default async function ToolsByCategory({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ToolsContent categorySlug={slug} />;
}
