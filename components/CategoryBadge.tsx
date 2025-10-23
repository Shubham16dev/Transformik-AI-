import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Map categories to dynamic colors
export const CATEGORY_COLORS: Record<string, string> = {
  "AI Agents": "bg-green-50 text-green-700 border-green-200",
  "AI Animation Tools": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Art Generators": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Chatbots": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Chrome Extensions": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Code Review Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Coding Assistants": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Copywriting Tools": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Customer Service Bots": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Customer Support": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Data Analysis Tools": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Data Visualization Tools":
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Deepfake & Face Swap Tools": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Fun Tools": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Games Tools": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Headshot Generators": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Image Generators": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Interior Design Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Lead Generation Tools": "bg-green-50 text-green-700 border-green-200",
  "AI Logo Generators": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Market Research Tools": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Meeting Assistants": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Music Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Paraphrasing Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Presentation Makers": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Product Photography": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Resume Builders": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Search Engine Tools": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Search Engines": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI SEO Tools": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Social Media Management": "bg-green-50 text-green-700 border-green-200",
  "AI Story Generators": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Summarizers": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Text Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Tools for Architects": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Tools for Artists": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Tools for Marketers": "bg-green-50 text-green-700 border-green-200",
  "AI Tools for Musicians": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Tools for Students": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Transcription Tools": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Translation Tools": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Video Editors": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Video Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Video Upscaling": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Voice Changers": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Voice Cloning": "bg-green-50 text-green-700 border-green-200",
  "AI Website Builders": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Workflow Automation": "bg-blue-50 text-blue-700 border-blue-200",
  "Free AI Tools": "bg-gray-50 text-gray-700 border-gray-200",
  "Future AI Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "Most Useful AI Tools": "bg-purple-50 text-purple-700 border-purple-200",
  "Open Source AI Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Text-to-Video Tools": "bg-pink-50 text-pink-700 border-pink-200",
};

interface CategoryBadgeProps {
  category: string;
}

function generateSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const badgeClass =
    CATEGORY_COLORS[category] || "bg-gray-50 text-gray-700 border-gray-200";

  // Redirect to /tools/category/[slug]
  const linkHref = `/tools/category/${generateSlug(category)}`;

  return (
    <Link href={linkHref}>
      <Badge
        variant="secondary"
        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-pointer whitespace-nowrap ${badgeClass}`}
      >
        {category}
      </Badge>
    </Link>
  );
};
