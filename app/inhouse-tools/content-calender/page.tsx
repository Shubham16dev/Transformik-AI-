"use client";

import { useState } from "react";
import { generateContentCalendar } from "./action";
import { Loader2, CalendarPlus, Brain, Clock, CalendarDays, AlertCircle } from "lucide-react";

interface ContentIdea {
  title: string;
  description: string;
  postType: string;
  isoDate: string;
}

interface ActionState {
  plan?: ContentIdea[];
  error?: string;
}

export default function ContentCalendarPage() {
  const [niche, setNiche] = useState("Sustainable gardening for urban dwellers");
  const [goals, setGoals] = useState("Increase brand awareness and drive traffic to our blog");
  const [frequency, setFrequency] = useState("3 times a week");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [numPosts, setNumPosts] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentPlan, setContentPlan] = useState<ContentIdea[]>([]);

  const createGCalLink = (item: ContentIdea) => {
    const formatGCalDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+Z/g, "");
    const start = new Date(item.isoDate);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Content Post: ${item.title}`,
      details: `${item.description}\n\nPost Type: ${item.postType}`,
      dates: `${formatGCalDate(start)}/${formatGCalDate(end)}`
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  };

  const formatDisplayDate = (isoString: string) =>
    new Date(isoString).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setContentPlan([]);
    try {
      const result: ActionState = await generateContentCalendar({
        niche,
        goals,
        frequency,
        startDate,
        numPosts,
      });
      if (result.error) setError(result.error);
      else if (result.plan) setContentPlan(result.plan);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100  rounded-lg p-4 sm:p-8 font-sans">
      <div className="w-full max-w-5xl">
        {/* ---------- Intro Section ---------- */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Content Calendar Builder
          </h1>
          <p className="text-lg text-gray-500">
            Generate a complete social media content calendar using AI — personalized to your niche, goals, and posting schedule.
          </p>
        </header>

        {/* ---------- Feature Cards ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <Brain className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 text-lg mb-1">AI-Powered Planning</h3>
            <p className="text-gray-500 text-sm">
              Get intelligent content ideas crafted by AI for your brand’s unique goals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <Clock className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 text-lg mb-1">Smart Scheduling</h3>
            <p className="text-gray-500 text-sm">
              Posts are auto-distributed based on your preferred frequency and timing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <CalendarDays className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 text-lg mb-1">Calendar Integration</h3>
            <p className="text-gray-500 text-sm">
              Add your planned posts directly to Google Calendar in one click.
            </p>
          </div>
        </div>

        {/* ---------- Tool Form Section ---------- */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 mb-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Niche */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Niche / Topic</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., AI productivity tools"
                required
              />
            </div>

            {/* Goals */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Goals</label>
              <input
                type="text"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Drive website traffic"
                required
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posting Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option>Daily</option>
                <option>3 times a week</option>
                <option>Weekly</option>
                <option>Weekdays only</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Number of Posts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Posts</label>
              <input
                type="number"
                value={numPosts}
                onChange={(e) => setNumPosts(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="1"
                max="30"
                required
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Generating...
                  </>
                ) : (
                  "Build My Calendar"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ---------- Output Section ---------- */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {contentPlan.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Generated Content Plan</h2>
            {contentPlan.map((item, index) => (
              <div key={index} className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div>
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
                      {item.postType}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-indigo-600 mt-1">{formatDisplayDate(item.isoDate)}</p>
                  </div>
                  <a
                    href={createGCalLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </a>
                </div>
                <p className="text-gray-600 mt-4 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
