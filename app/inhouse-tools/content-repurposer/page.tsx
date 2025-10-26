// app/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon, Zap, Twitter, Instagram, Linkedin, Film } from 'lucide-react';

interface RepurposeResult {
  title: string;
  content: string;
  platform: 'X' | 'Instagram' | 'LinkedIn' | 'TikTok';
}

interface RepurposeResponse {
  twitter: RepurposeResult[];
  instagram: RepurposeResult[];
  linkedin: RepurposeResult;
  tiktok: RepurposeResult;
}

const initialResults: RepurposeResponse = {
  twitter: [],
  instagram: [],
  linkedin: { title: '', content: '', platform: 'LinkedIn' },
  tiktok: { title: '', content: '', platform: 'TikTok' }
};

async function callRepurposerLLM(longFormContent: string): Promise<RepurposeResponse> {
  await new Promise(resolve => setTimeout(resolve, 2500));

  return {
    twitter: [
      { title: 'The 5-Point Thread Hook', content: '1/5: Stop wasting time on content creation. We cracked the code on repurposing. Here are 4 steps to a 10x workflow 🧵👇', platform: 'X' },
      { title: 'Value-Driven Thread', content: '2/5: Key Takeaway: Long-form content is your gold mine. Don’t just post it once—shred it into micro-content. That’s the entire game. Learn how: [Link]', platform: 'X' },
      { title: 'Q&A Thread', content: '3/5: Q: What’s the hardest part of repurposing? A: Formatting for different platforms. This tool solves it in a click. What are your content challenges? Reply below!', platform: 'X' },
    ],
    instagram: [
      { title: 'Caption/Hook 1: The CTA', content: '🚨 You need to see this. We took 4,000 words of content and got 10 posts in 5 minutes. Tap the link in bio to steal our secret. #ContentHacks', platform: 'Instagram' },
      { title: 'Caption/Hook 2: Short Value', content: 'The single best way to beat creator burnout? Stop starting from scratch. Repurpose, reuse, and dominate the feed. Double-tap if you agree! 🤝', platform: 'Instagram' },
    ],
    linkedin: {
      title: 'LinkedIn Article Intro',
      content: 'I recently published a piece on the inevitable shift to AI-powered content workflows. The core insight? The most valuable content is the content you already own. Start here: [Link]',
      platform: 'LinkedIn'
    },
    tiktok: {
      title: 'TikTok/Reel Script Concept (15s)',
      content: '[SCENE 1: (0-3s) Creator looks stressed, hunched over laptop.]\nCreator Voiceover: "Posting to 5 platforms is killing my week."\n[SCENE 2: (3-10s) Quick cuts of AI tool screen. User pastes content. Hits "Generate."]\nCreator Voiceover: "Enter the Repurposer. One piece of content, 10+ assets."\n[SCENE 3: (10-15s) Creator smiles, pointing at screen.]\nCaption: Link in Bio for the 10x workflow. #ReelHacks',
      platform: 'TikTok'
    }
  };
}

const ToolLayout: React.FC<{ children: React.ReactNode; title: string; description: string; }> = 
  ({ children, title, description }) => (
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

const InputArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-500 resize-none transition-colors"
    {...props}
  />
);

const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }> = 
  ({ children, loading, ...props }) => (
    <button
      className={`w-full py-3 px-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 
        ${loading || props.disabled 
          ? 'bg-indigo-700/50 cursor-not-allowed' 
          : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'
        }
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );

const OutputCard: React.FC<RepurposeResult> = ({ title, content, platform }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-xl border border-gray-700 hover:border-indigo-500 transition-all">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-xs text-indigo-300 uppercase tracking-widest">{platform} - {title}</h4>
        <button 
          className={`p-1 rounded-md transition-colors ${copied ? 'text-green-400' : 'text-gray-400 hover:text-indigo-400'}`}
          onClick={handleCopy}
          title="Copy to Clipboard"
        >
          {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-gray-200 text-sm whitespace-pre-wrap">{content}</p>
    </div>
  );
};


const ResultsSection: React.FC<{ title: string; icon: React.ElementType; assets: RepurposeResult | RepurposeResult[] }> = 
  ({ title, icon: Icon, assets }) => (
    <div className="space-y-4 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-inner">
      <h3 className="flex items-center text-lg font-semibold text-indigo-400">
        <Icon className="w-5 h-5 mr-3" /> {title}
      </h3>
      <div className="space-y-3">
        {Array.isArray(assets) 
          ? assets.map((asset, index) => <OutputCard key={index} {...asset} />)
          : <OutputCard {...assets} /> // Single asset (LinkedIn, TikTok)
        }
      </div>
    </div>
  );


export default function ContentRepurposerPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RepurposeResponse>(initialResults);

  const handleGenerate = async () => {
    if (!content.trim()) return;

    setLoading(true);
    setResults(initialResults); // Clear previous results

    try {
      const response = await callRepurposerLLM(content);
      setResults(response);
    } catch (error) {
      console.error('LLM API Error:', error);
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
            {loading ? 'AI Working...' : 'Generate 10+ Social Assets'}
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
              <p className="text-lg">Your generated content will appear here.</p>
              <p className="text-sm mt-2">Paste your long-form text and hit 'Generate' to begin.</p>
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