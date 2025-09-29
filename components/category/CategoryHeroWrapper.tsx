"use client";

import { usePathname } from "next/navigation";
import { CategoryHero } from "./CategoryHero";

export function CategoryHeroWrapper() {
  const pathname = usePathname();
  if (pathname !== "/categories") return null;
  return <CategoryHero />;
}