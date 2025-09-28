"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          AI Tools Hub
        </Link>

        {/* Nav Links */}
        <div className="flex gap-6">
          <Link href="/tools">All Tools</Link>
          <Link href="/blog">Blog</Link>
        </div>

        {/* Optional CTA */}
        <Button asChild>
          <Link href="/tools">Explore Tools</Link>
        </Button>
      </div>
    </nav>
  );
}
