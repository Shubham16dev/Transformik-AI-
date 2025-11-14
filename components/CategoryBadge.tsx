import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Map categories to dynamic colors
export const CATEGORY_COLORS: Record<string, string> = {
  "AI Novel Writing Tools": "bg-green-50 text-green-700 border-green-200",
  "AI Blog Generators": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Tools for Book Writing": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Caption Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Chat Generators": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Cover Letter Generators": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Creative Writing Tools": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Description Generators": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Dialogue Generators": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Ebook Generators": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Email Writers": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Essay Writers": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Fanfic Generators": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Grammar Checkers": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Image Description Generators": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Inspirational Quote Generators":
    "bg-green-50 text-green-700 border-green-200",
  "AI Job Description Generators":
    "bg-orange-50 text-orange-700 border-orange-200",
  "AI Letter Writers": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Love Letter Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Message Generators": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Movie Script Generators":
    "bg-purple-50 text-purple-700 border-purple-200",
  "AI Name Generators": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Newsletter Generators": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Age Progression Tools":
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Avatar Generators": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Background Generators": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Background Remover Tools":
    "bg-violet-50 text-violet-700 border-violet-200",
  "AI Clothing Removal Tools":
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Colorize Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Cosplay Generators": "bg-green-50 text-green-700 border-green-200",
  "AI Crop Image Tools": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Eraser Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Expand Image Tools": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Face Swap Generators": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Headshot Generators": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Image Combiner Tools": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Image Enhancer Tools": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Image Generators": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Image Sharpening Tools": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Image Upscalers": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Inpainting Tools": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Map Generators": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Outpainting Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Passport Photo Tools": "bg-green-50 text-green-700 border-green-200",
  "AI Person Generators": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Photo Editor Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Photo Enhancers": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Describe Image Tools": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Face Analyzers": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Face Recognition Tools": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Image Recognition Tools": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Image Scanning Tools":
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Image Segmentation Tools": "bg-blue-50 text-blue-700 border-blue-200",
  "AI OCR Tools": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Image to Prompt Tools": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Audio Editing Tools": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Audio Enhancer Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Audio Splitters": "bg-green-50 text-green-700 border-green-200",
  "AI Beat Generators": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Instrumental Generators":
    "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Lyrics Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Mastering Tools": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Melody Generators": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Midi Generators": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Music Generators": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Noise Cancellation Tools":
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Rap Generators": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Rap Lyrics Generators": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Singing Generators": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Song Cover Tools": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Song Generators": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Song Remixers": "bg-green-50 text-green-700 border-green-200",
  "AI Sound Effect Generators":
    "bg-orange-50 text-orange-700 border-orange-200",
  "AI Splitter Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Stems Splitters": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Text-to-Music Tools": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Vocal Removers": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Celebrity Voice Generators": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Dubbing Tools": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Podcast Tools": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Podcast Clip Generators": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Podcast Editing Tools": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Recording Tools": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Speech Recognition Tools":
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Speech Synthesis Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Speech-to-Text Tools": "bg-green-50 text-green-700 border-green-200",
  "AI Text-to-Speech Tools": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Transcriber Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Transcription Tools": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Voice Assistants": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Voice Changer Tools": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Voice Enhancers": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Voice Generators": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Voice Overs": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Audio To Text tools": "bg-blue-50 text-blue-700 border-blue-200",
  "Tiktok AI Voice Generators": "bg-rose-50 text-rose-700 border-rose-200",
  "AI 3D Model Generators": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Album Cover Generators":
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Anime Art Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Anime Generators": "bg-green-50 text-green-700 border-green-200",
  "AI Art Generators": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Banner Generators": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Beauty Tools": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Bikini Tools": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Book Cover Generators": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Brochure Maker Tools": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Business Card Generators": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Cartoon Generators": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Cat Tools": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Clothing Generators": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Color Palette Generators":
    "bg-violet-50 text-violet-700 border-violet-200",
  "AI Coloring Book Generators":
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Comic Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Comic Generators": "bg-green-50 text-green-700 border-green-200",
  "AI Cover Generators": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Design Assistants": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Design Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Drawing Tools": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Bio Generators": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Tools for Facebook": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Hashtag Generators": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Influencer Tools": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Tools for Instagram": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Instagram Caption Generators": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Linkedin Headshot Generators":
    "bg-violet-50 text-violet-700 border-violet-200",
  "AI Linkedin Photo Generators":
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Meme Generators": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Instagram Model Tools": "bg-green-50 text-green-700 border-green-200",
  "AI Pick-up Lines Generators":
    "bg-orange-50 text-orange-700 border-orange-200",
  "AI Rizz Generators": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Social Media Tools": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Social Media Post Generators":
    "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Tools for Tiktok": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Tweet Generators": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Tools for Twitter": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Username Generators": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Tools for YouTube": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Youtube Summary Generators": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Youtube Thumbnail Generators":
    "bg-violet-50 text-violet-700 border-violet-200",
  "AI Art Detectors": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Bypasser Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Essay Checker Tools": "bg-green-50 text-green-700 border-green-200",
  "AI Content Detectors": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Detector Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Image Detectors": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Video Editors": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Video Enhancers": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Video Generators": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Video Recording Tools": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Video Search Tools": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Video Summarizers": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Video Upscalers": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Vtuber Makers": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Youtube Video Makers":
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Baby Generators": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Cooking Assistants": "bg-green-50 text-green-700 border-green-200",
  "AI Dream Interpreters": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Tools for Fitness": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Gift Ideas Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI News Tools": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Newsletter Tools": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Outfit Generators": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Parenting Tools": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Pickup Lines Generators":
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Portrait Generators": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Recipe Generators": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Selfie Generators": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Shopping Assistants": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Tools for Sports": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Travel Tools": "bg-green-50 text-green-700 border-green-200",
  "AI Trip Planners": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Accounting Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Contract Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Contract Management Tools":
    "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Contract Review Tools": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Tools For Finance": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Investing Tools": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Legal Assistants": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Tools for Real Estate": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Stock Trading Tools": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Tax Assistants": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Trading Bots": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Tools for CRM": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Tools for Call Center": "bg-green-50 text-green-700 border-green-200",
  "AI Customer Service Tools": "bg-orange-50 text-orange-700 border-orange-200",
  "AI ERP Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Interview Assistants": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Product Management Tools":
    "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Recruiting Tools": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Ad Generators": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Advertising Tools": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Affiliate Marketing Tools":
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Cold Calling Tools": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Tools for Digital Marketing": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Email Generators": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Tools for Email Marketing":
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Flyer Generators": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Lead Generation Tools": "bg-green-50 text-green-700 border-green-200",
  "AI Marketing Tools": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Marketing Plan Generators":
    "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Pitch Deck Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Sales Tools": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Sales Assistants": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Shopify Store Builders": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Website Designers": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Ad Copy Tools": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Tools for Google Ads": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Tools for SEO Writing": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Dermatology Tools": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Healthcare Tools": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Medical Diagnosis Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Mental Health Tools": "bg-green-50 text-green-700 border-green-200",
  "AI Symptom Checkers": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Therapist Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Business Ideas Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Business Name Generators":
    "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Company Name Generators":
    "bg-purple-50 text-purple-700 border-purple-200",
  "AI Consulting Tools": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Tools for Crypto": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Domain Name Generators":
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Tools for Blockchain": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Tools for NFTs": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Tools for Web3": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Article Summarizers": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Book Summarizers": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Coaching Tools": "bg-green-50 text-green-700 border-green-200",
  "AI Course Tools": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Flashcard Makers": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Homework Helpers": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Image Translators": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Language Learning Tools":
    "bg-purple-50 text-purple-700 border-purple-200",
  "AI Lesson Plan Generators": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Math Tools": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Mind Mapping Tools": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Question Generators": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Quiz Generators": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Tools for Teachers": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Translation Tools": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Video Translators": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Voice Translators": "bg-green-50 text-green-700 border-green-200",
  "AI Anime Girlfriend Tools": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Boyfriend Tools": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Characters Tools": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Chatbots": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Dating Assistants": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Girlfriend Tools": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Joke Generators": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Roleplay Tools": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Dirty Talking AI Tools": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Backyard Designers": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Floor Plan Generators": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Interior Design Tools":
    "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Kitchen Design Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Landscape Generators": "bg-green-50 text-green-700 border-green-200",
  "AI Room Planners": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Agents": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Assistants": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Diagram Generators": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Document Extraction Tools":
    "bg-purple-50 text-purple-700 border-purple-200",
  "AI Documents Generators": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Email Assistants": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Excel Formula Generators":
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Meeting Assistants": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Monitoring Tools": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Note Takers": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Notes Generators": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Tools for PDF": "bg-teal-50 text-teal-700 border-teal-200",
  "AI PDF Editors": "bg-green-50 text-green-700 border-green-200",
  "AI PDF Summarizers": "bg-orange-50 text-orange-700 border-orange-200",
  "AI PPT Makers": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "AI Presentation Generators": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Productivity Tools": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "AI Data Mining Tools": "bg-purple-50 text-purple-700 border-purple-200",
  "AI Data Analytics Tools": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "AI Research Tools": "bg-lime-50 text-lime-700 border-lime-200",
  "AI Sports Betting Tools":
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AI Sports Predictions Tools": "bg-blue-50 text-blue-700 border-blue-200",
  "AI Game Generators": "bg-rose-50 text-rose-700 border-rose-200",
  "AI Games Tools": "bg-violet-50 text-violet-700 border-violet-200",
  "AI Models Generators": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "AI Poker Tools": "bg-teal-50 text-teal-700 border-teal-200",
  "AI Robots": "bg-green-50 text-green-700 border-green-200",
  "Other AI Tools": "bg-gray-50 text-gray-700 border-gray-200",
};

interface CategoryBadgeProps {
  category: string;
}

function generateSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const badgeClass =
    CATEGORY_COLORS[category] || "bg-gray-50 text-gray-700 border-gray-200";

  // Redirect to /tools/category/[slug]
  const linkHref = `/tools/category/${generateSlug(category)}`;

  return (
    <Link href={linkHref} className="max-w-full">
      <Badge
        variant="secondary"
        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-pointer whitespace-nowrap truncate max-w-full inline-block ${badgeClass}`}
        title={category}
      >
        {category}
      </Badge>
    </Link>
  );
};
