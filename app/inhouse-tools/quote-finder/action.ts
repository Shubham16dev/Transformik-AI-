"use server";

import {
  GoogleGenerativeAI,
  GenerationConfig,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

type Quote = {
  quote: string;
  author: string;
  source: string;
  tags?: string[];
};

type ActionResult = {
  data?: Quote[];
  error?: string;
};

// --- Initialize Gemini ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- Generation Config ---
const generationConfig: GenerationConfig = {
  responseMimeType: "application/json",
  temperature: 0.3,
  topP: 1,
  topK: 1,
  maxOutputTokens: 2048,
};

// --- System Instruction ---
const systemInstruction = `You are a world-class Quote Finder AI.
Your goal is to find verified and factual quotes relevant to the user's request.
You must respond *only* with a JSON array in this format:
[
  {
    "quote": "The only limit to our realization of tomorrow is our doubts of today.",
    "author": "Franklin D. Roosevelt",
    "source": "Speech, 1945",
    "tags": ["inspiration", "motivation"]
  }
]
- Include up to 5 quotes maximum.
- Ensure quotes are real and attributed correctly.
- Never include explanations or markdown, just the JSON array.
If no quotes are found, return an empty array [].
`;

export async function searchQuotesAction(
  searchType: string,
  query: string
): Promise<ActionResult> {
  if (!process.env.GEMINI_API_KEY) {
    return { error: "Missing GEMINI_API_KEY environment variable." };
  }

  if (!query?.trim()) {
    return { error: "Please provide a valid search query." };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
      systemInstruction,
      generationConfig,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const prompt = `Search Type: ${searchType}
Search Query: "${query}"
Find up to 5 verified quotes that match this request.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      const parsed: Quote[] = JSON.parse(text);
      return { data: parsed };
    } catch (err) {
      console.error("JSON parse error:", text);
      return {
        error:
          "The model returned invalid JSON. Try rephrasing your query or check the model output.",
      };
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to fetch quotes. Please try again later." };
  }
}
