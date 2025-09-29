// components/layout/HomeHeroWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { HeroSection } from "./HeroSection";

export function HomeHeroWrapper() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <HeroSection tools={[]} />;
}
