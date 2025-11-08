"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Define the shape of the form inputs
interface CalendarInputs {
  niche: string;
  goals: string;
  frequency: string;
  startDate: string;
  numPosts: number;
}

// Define the shape of a single content idea
interface ContentIdea {
  title: string;
  description: string;
  postType: string;
  isoDate: string;
}

// Define the return type for our server action
interface ActionState {
  plan?: ContentIdea[];
  error?: string;
}

// Load API key from environment variable
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(apiKey);

// Server Action
export async function generateContentCalendar(
  inputs: CalendarInputs
): Promise<ActionState> {
  const { niche, goals, frequency, startDate, numPosts } = inputs;

  const systemPrompt = `
    You are a world-class social media strategist and content planner.
    Your task is to generate a detailed content calendar based on user specifications.

    You MUST return the answer *only* as a JSON array of content ideas.
    Each object must contain: title, description, postType, and isoDate.

    Rules for isoDate:
    - Start from the provided startDate.
    - Space out the posts according to the frequency.
    - Assign realistic posting times (9 AM – 5 PM).
    - Use ISO 8601 format, e.g. "2025-10-30T09:00:00Z".
    - Keep posts in chronological order.
  `;

  const userQuery = `
    Please generate a content calendar with:
    - Niche: ${niche}
    - Goals: ${goals}
    - Frequency: ${frequency}
    - Start Date: ${startDate}
    - Number of Posts: ${numPosts}
  `;

  try {
    // Use Gemini SDK
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8,
        topP: 0.9,
      },
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }],
      },
    });

    const result = await model.generateContent([userQuery]);
    const text = result.response.text();

    // Parse the AI output
    const plan: ContentIdea[] = JSON.parse(text);

    if (!Array.isArray(plan)) {
      throw new Error("Invalid response format: expected an array.");
    }

    return { plan };
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return { error: err.message || "Failed to generate content calendar." };
  }
}
