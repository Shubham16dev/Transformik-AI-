'use server';

import {
  GoogleGenerativeAI,
  GenerationConfig,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

// --- Interfaces (Needed by the server) ---
interface RepurposeResult {
  title: string;
  content: string;
  platform: 'X' | 'Instagram' | 'LinkedIn' | 'TikTok';
}

export interface RepurposeResponse {
  twitter: RepurposeResult[];
  instagram: RepurposeResult[];
  linkedin: RepurposeResult;
  tiktok: RepurposeResult;
}

// --- Gemini Configuration ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const generationConfig: GenerationConfig = {
  responseMimeType: 'application/json',
  temperature: 0.7,
  topP: 1,
  topK: 1,
  maxOutputTokens: 8192,
};

const tsInterfaces = `
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
`;

const systemInstruction = `You are an expert social media manager. Your task is to repurpose a piece of long-form content into a suite of social media assets. The user will provide the long-form content.

You must return *only* a valid JSON object adhering to the following TypeScript interface:
${tsInterfaces}

Guidelines:
- Generate 2-3 Twitter/X thread hooks/ideas.
- Generate 2 Instagram caption hooks.
- Generate 1 LinkedIn post introduction.
- Generate 1 TikTok/Reel script concept.
- Ensure the 'platform' field is correctly set for each object.
- The content should be engaging, professional, and optimized for each platform.
- Do not include any other text, markdown (like \`\`\`json), or explanations outside of the single, valid JSON object.`;

// --- The Exported Server Action ---
export async function generateSocialAssets(
  longFormContent: string,
): Promise<RepurposeResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  if (!longFormContent) {
    throw new Error('Missing longFormContent');
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'models/gemini-2.5-pro',
      systemInstruction: systemInstruction,
      generationConfig,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const result = await model.generateContent(longFormContent);
    const responseText = result.response.text();
    const jsonResponse: RepurposeResponse = JSON.parse(responseText);

    return jsonResponse;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate content');
  }
}