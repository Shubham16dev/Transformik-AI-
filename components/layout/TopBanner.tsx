// components/layout/TopBanner.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TopBanner() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("top-banner-dismissed");
    setHidden(dismissed === "1");
  }, []);

  if (hidden) return null;

  return (
    <div
      role="region"
      aria-label="Site announcement"
      aria-live="polite"
      className="w-full bg-gradient-to-r from-indigo-200 via-violet-200 to-sky-200 text-sm text-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="sr-only">Announcement</span>
          <span className="text-sm font-medium">Sponsored by</span>

          {/* Highlighted sponsor badge */}
          <Link
            href="https://optimence.com"
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label="Optimence — Get Featured on Top Sites"
            className="text-lg sm:text-lg md:text-2xl font-bold underline"
          >
            Optimence
          </Link>

          <span className="hidden sm:inline">
            – Get Featured on Top Sites → Build Trust & Rankings Together
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="https://optimence.com/about/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center px-3 py-1 rounded-md bg-slate-900 text-white text-sm hover:opacity-95"
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}
