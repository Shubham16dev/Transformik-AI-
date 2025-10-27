"use client";

import React, { useState, useTransition } from "react";
import {
  Search,
  Brain,
  Grid,
  Loader2,
  BookOpen,
  Quote,
  User,
  Clipboard,
  CheckCircle,
} from "lucide-react";
import { searchQuotesAction } from "./action";

// --- Types ---
type QuoteResult = {
  quote: string;
  author: string;
  source: string;
  tags?: string[];
};

// --- Sub-Components ---

// Header Feature Card
const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 min-h-[180px]">
    <div className="p-3 mb-4 bg-indigo-100 rounded-full text-indigo-600">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
      {title}
    </h3>
    <p className="text-sm text-gray-500 text-center">{description}</p>
  </div>
);

// Quote Result Card with Copy Functionality
const QuoteCard = ({ quote, author, source, tags }: QuoteResult) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // navigator.clipboard is available in secure contexts (like localhost or HTTPS)
    // which is standard for a client component.
    const textToCopy = `"${quote}"\n- ${author}, ${source}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        // You could show an error toast here
      });
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-md border-l-4 border-indigo-500 mb-6 transition-all duration-300 hover:shadow-lg relative">
      <blockquote className="text-xl font-medium text-gray-700 leading-relaxed mb-4 italic pr-10">
        <Quote className="inline w-5 h-5 mr-2 text-indigo-400 -translate-y-1" />
        {quote}
      </blockquote>
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
        title={copied ? "Copied!" : "Copy quote"}
      >
        {copied ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <Clipboard className="w-5 h-5" />
        )}
      </button>
      <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-gray-100">
        <p className="text-base text-gray-800 font-semibold flex items-center mb-2 md:mb-0">
          <User className="w-4 h-4 mr-2 text-indigo-500" />
          {author}
          <span className="ml-4 text-sm text-gray-500 font-normal flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {source}
          </span>
        </p>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function Page() {
  // State for the search UI
  const searchTypes = ["Text", "Author", "Book", "Theme"];
  const [activeTab, setActiveTab] = useState("Text");
  const [query, setQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");

  // State for handling the server action
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<QuoteResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setError(null);
    setResults(null);

    // startTransition manages the loading state (isPending)
    startTransition(async () => {
      const result = await searchQuotesAction(activeTab, query);

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        if (result.data.length === 0) {
          setResults([]); // No results found
        } else {
          setResults(result.data);
        }
      }
    });
  };

  return (
    // We assume Tailwind is set up in layout.tsx
    <div className="min-h-screen bg-gray-100 rounded-lg font-sans p-4 sm:p-8">
      {/* Header */}
      <header className="max-w-4xl mx-auto text-center py-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Quote Finder - Book Quote Search
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Search by author, theme, or book to discover verified quotes using
          Quote Finder, AI powered Book Quote Search Tool.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Feature Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={Search}
            title="Quote Search Tool"
            description="Author, theme, book or quote based search"
          />
          <FeatureCard
            icon={Brain}
            title="AI-Powered Search"
            description="Discover quotes from famous authors and contemporary novels"
          />
          <FeatureCard
            icon={Grid}
            title="Themed Collections"
            description="Browse inspirational quotes and friendship quotes in our curated collections"
          />
        </section>

        {/* Search Panel */}
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Search Type
          </h2>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6 p-1 bg-gray-50 rounded-lg max-w-full overflow-x-auto">
            {searchTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setActiveTab(type);
                  setQuery("");
                  setResults(null);
                  setError(null);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === type
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                disabled={isPending}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              placeholder={`Search by ${activeTab.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow disabled:bg-gray-100"
              disabled={isPending}
              required
            />
            <div className="relative">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="appearance-none block w-full bg-white border border-gray-300 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 disabled:bg-gray-100 sm:w-32"
                disabled={isPending}
              >
                <option>All</option>
                <option>Historical</option>
                <option>Fiction</option>
                <option>Poetry</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
              disabled={isPending || !query.trim()}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Search className="w-5 h-5 mr-2" />
              )}
              Search
            </button>
          </form>
        </section>

        {/* Results Section */}
        <section>
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {isPending && (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
              <p className="text-lg text-gray-600">
                Searching for verified quotes on &quot;{query}&quot;...
              </p>
            </div>
          )}

          {/* Initial State (No search yet) */}
          {results === null && !isPending && !error && (
            <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">
              <Quote className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">
                Start Your Quote Search
              </h3>
              <p className="text-gray-500">
                Enter a query above to find inspiring and accurate quotes
                powered by AI.
              </p>
            </div>
          )}

          {/* Results Found */}
          {results && results.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Results for:{" "}
                <span className="text-indigo-600">&quot;{query}&quot;</span>
              </h2>
              <div className="grid gap-6">
                {results.map((item, index) => (
                  <QuoteCard key={index} {...item} />
                ))}
              </div>
            </div>
          )}

          {/* No Results Found */}
          {results && results.length === 0 && !isPending && (
            <div className="text-center p-12 bg-yellow-50 rounded-xl shadow-lg border border-yellow-300">
              <Search className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Quotes Found
              </h3>
              <p className="text-gray-500">
                The AI could not find any verifiable quotes matching your query.
                Please try different keywords.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
