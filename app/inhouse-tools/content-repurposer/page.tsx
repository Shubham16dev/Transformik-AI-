"use client";

import React, { useState, useCallback } from "react";
import {
  CopyIcon,
  CheckIcon,
  Zap,
  Twitter,
  Instagram,
  Linkedin,
  Film,
} from "lucide-react";
// Import the action
import { generateSocialAssets, type RepurposeResponse } from "./action";

// --- Interfaces (Needed by the client for state) ---
interface RepurposeResult {
  title: string;
  content: string;
  platform: "X" | "Instagram" | "LinkedIn" | "TikTok";
}

const initialResults: RepurposeResponse = {
  twitter: [],
  instagram: [],
  linkedin: { title: "", content: "", platform: "LinkedIn" },
  tiktok: { title: "", content: "", platform: "TikTok" },
};

// --- (ToolLayout Component) ---
const ToolLayout: React.FC<{
  children: React.ReactNode;
  title: string;
  description: string;
}> = ({ children, title, description }) => (
  <div className="min-h-screen bg-gray-950 text-gray-100">
    <header className="py-6 bg-gray-900 border-b border-indigo-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-indigo-400">{title}</h1>
        <p className="mt-1 text-gray-400">{description}</p>
      </div>
    </header>
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {children}
    </main>
  </div>
);

// --- (InputArea Component) ---
const InputArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (
  props
) => (
  <textarea
    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-500 resize-none transition-colors"
    {...props}
  />
);

// --- (PrimaryButton Component) ---
const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
> = ({ children, loading, ...props }) => (
  <button
    className={`w-full py-3 px-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 
      ${
        loading || props.disabled
          ? "bg-indigo-700/50 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30"
      }
    `}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <span className="flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {children}
      </span>
    ) : (
      children
    )}
  </button>
);

// --- (OutputCard Component) ---
const OutputCard: React.FC<RepurposeResult> = ({
  title,
  content,
  platform,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-xl border border-gray-700 hover:border-indigo-500 transition-all">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-xs text-indigo-300 uppercase tracking-widest">
          {platform} - {title}
        </h4>
        <button
          className={`p-1 rounded-md transition-colors ${
            copied ? "text-green-400" : "text-gray-400 hover:text-indigo-400"
          }`}
          onClick={handleCopy}
          title="Copy to Clipboard"
        >
          {copied ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <CopyIcon className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="text-gray-200 text-sm whitespace-pre-wrap">{content}</p>
    </div>
  );
};

// --- (ResultsSection Component) ---
const ResultsSection: React.FC<{
  title: string;
  icon: React.ElementType;
  assets: RepurposeResult | RepurposeResult[];
}> = ({ title, icon: Icon, assets }) => (
  <div className="space-y-4 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-inner">
    <h3 className="flex items-center text-lg font-semibold text-indigo-400">
      <Icon className="w-5 h-5 mr-3" /> {title}
    </h3>
    <div className="space-y-3">
      {Array.isArray(assets) ? (
        assets.map((asset, index) => <OutputCard key={index} {...asset} />)
      ) : (
        <OutputCard {...assets} />
      )}
    </div>
  </div>
);

// --- (Main Page Component) ---
export default function Page() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RepurposeResponse>(initialResults);

  const handleGenerate = async () => {
    if (!content.trim()) return;

    setLoading(true);
    setResults(initialResults);

    try {
      // This call now works because it's calling an imported Server Action
      const response = await generateSocialAssets(content);
      setResults(response);
    } catch (error) {
      console.error("Failed to generate content:", error);
      // You can add user-facing error state here
    } finally {
      setLoading(false);
    }
  };

  const hasResults = results.twitter.length > 0;

  return (
    <ToolLayout
      title="Social Media Content Repurposer"
      description="Turn any long-form content into a full suite of optimized social assets using AI."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit">
          <h2 className="text-2xl font-bold text-gray-100 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-400" />
            1. Input & Generate
          </h2>
          <InputArea
            placeholder="Paste your blog post, video transcript, or podcast summary here (min 50 words recommended)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            disabled={loading}
          />
          <PrimaryButton
            onClick={handleGenerate}
            disabled={content.trim().length < 50}
            loading={loading}
          >
            {loading ? "AI Working..." : "Generate 10+ Social Assets"}
          </PrimaryButton>
        </div>

        <div className="space-y-10">
          <h2 className="text-2xl font-bold text-gray-100">
            2. Repurposed Assets
          </h2>

          {loading && (
            <div className="text-center p-8 text-indigo-400">
              <Zap className="w-12 h-12 animate-pulse mx-auto" />
              <p className="mt-4">Analyzing content and generating assets...</p>
            </div>
          )}

          {!hasResults && !loading && (
            <div className="text-center p-12 bg-gray-800 rounded-xl border border-dashed border-gray-600 text-gray-400">
              <p className="text-lg">
                Your generated content will appear here.
              </p>
              <p className="text-sm mt-2">
                Paste your long-form text and hit &apos;Generate&apos; to begin.
              </p>
            </div>
          )}

          {hasResults && (
            <>
              <ResultsSection
                title={`${results.twitter.length} Twitter/X Threads`}
                icon={Twitter}
                assets={results.twitter}
              />

              <ResultsSection
                title={`${results.instagram.length} Instagram Captions & Hooks`}
                icon={Instagram}
                assets={results.instagram}
              />

              <ResultsSection
                title="LinkedIn Article Introduction"
                icon={Linkedin}
                assets={results.linkedin}
              />

              <ResultsSection
                title="TikTok/Reel Script Concept"
                icon={Film}
                assets={results.tiktok}
              />
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
