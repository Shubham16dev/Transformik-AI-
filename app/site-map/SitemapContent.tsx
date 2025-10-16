"use client";

import Link from "next/link";

interface BlogSummary {
  id: string;
  title: string;
  slug: string;
  created_at: string;
}

interface SitemapContentProps {
  blogs: BlogSummary[];
}

export function SitemapContent({ blogs }: SitemapContentProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Site Map</h1>
      <p className="text-gray-600 mb-8 text-center">
        Find all pages and content on Transformik AI
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Pages */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            Main Pages
          </h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/"
                className="text-blue-600 hover:text-purple-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/tools"
                className="text-blue-600 hover:text-purple-600 transition-colors"
              >
                AI Tools
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-blue-600 hover:text-purple-600 transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/free-tools"
                className="text-blue-600 hover:text-purple-600 transition-colors"
              >
                Free Tools
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-blue-600 hover:text-purple-600 transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Blog Posts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            Latest Blog Posts
          </h2>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {blogs.map((blog) => (
              <li key={blog.id}>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-blue-600 hover:text-purple-600 transition-colors text-sm line-clamp-2"
                  title={blog.title}
                >
                  {blog.title}
                </Link>
                <span className="text-xs text-gray-400 block" suppressHydrationWarning>
                  {new Date(blog.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
          {blogs.length > 10 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/blog"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                View All Blogs →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* SEO Info */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">For Search Engines</h2>
        <p className="text-gray-600 mb-2">
          Our XML sitemap is automatically generated and available at:
        </p>
        <code className="bg-white px-3 py-2 rounded border text-sm">
          https://transformik.com/sitemap.xml
        </code>
      </div>
    </div>
  );
}
