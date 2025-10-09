"use client";

import { usePathname } from "next/navigation";
import { CategoryHero } from "./CategoryHero";

export function CategoryHeroWrapper() {
  const pathname = usePathname();
  if (pathname !== "/tools/category") return null;
  return <CategoryHero />;
}