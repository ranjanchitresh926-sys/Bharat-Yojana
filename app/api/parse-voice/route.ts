import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { CitizenProfile } from '../../../types/scheme';

// Initialize the official Google Gen AI SDK client using your environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Mirrors CitizenProfile — validated so a malformed or unexpected model
// response fails cleanly instead of crashing the route or silently
// corrupting the citizen's profile with garbage values.
const citizenProfileSchema = z.object({
  age: z.number().min(0).max(120),
  annualIncome: z.number().min(0),
  casteCategory: z.enum(['General', 'OBC', 'SC', 'ST']),
  gender: z.enum(['Male', 'Female', 'Other']),
  occupation: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  landholdingAcres: z.number().min(0),
  isBPLCardHolder: z.boolean(),
  isDisabled: z.boolean(),
}) satisfies z.ZodType<CitizenProfile>;

// ── Basic in-memory rate limiting ─────────────────────────────────────────
// This calls a paid external API per request, so it shouldn't be left wide
// open. In-memory is fine for a single-instance hackathon deployment; a
// real multi-instance production deployment would need a shared store
// (e.g. Redis) instead.
const RATE_LIMIT = 10; // requests
const RATE_WINDOW_MS = 60_000; // per minute
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(key, timestamps);
  return timestamps.length > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'No text provided' }, { status: 400 });
    }

    const prompt = `You are an expert Indian Government Data Extraction Engine.
Analyze the following citizen transcript (which may be in Hindi, Tamil, Telugu, Marathi, Bengali, or English) and extract the profile fields.

IMPORTANT INSTRUCTION: ONLY include fields in your JSON response that are EXPLICITLY mentioned or clearly implied in the transcript. If the user does not mention a field, OMIT IT ENTIRELY from the JSON object. Do not return null, and do NOT use default values for missing fields.

Return ONLY a raw JSON object matching this partial schema, with no markdown code blocks (no \`\`\`json), no conversational filler, and no extra text:
{
  "age": number (only if mentioned),
  "annualIncome": number in INR (convert regional terms like "5 lakh" to 500000, only if mentioned),
  "casteCategory": "General" | "OBC" | "SC" | "ST" (only if mentioned),
  "gender": "Male" | "Female" | "Other" (only if mentioned or clearly implied),
  "occupation": string (only if mentioned, e.g., "Farmer", "Student"),
  "state": string (exact Indian state name, only if mentioned),
  "landholdingAcres": number (convert local units or acres to a float number, only if mentioned),
  "isBPLCardHolder": boolean (true if they mention BPL/ration card, only if mentioned),
  "isDisabled": boolean (true if disability is mentioned, only if mentioned)
}

Transcript to parse: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
    });

    const responseText = response.text ? response.text.trim() : '';

    // Sanitize output to remove markdown ticks if the model includes them
    const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    let rawProfile: unknown;
    try {
      rawProfile = JSON.parse(cleanJsonText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'PARSE_VALIDATION_FAILED',
          message: "Couldn't understand that clearly. Please try again or fill the form manually.",
        },
        { status: 422 },
      );
    }

    const validation = citizenProfileSchema.partial().safeParse(rawProfile);
    if (!validation.success) {
      console.error('Voice profile failed schema validation:', validation.error.flatten());
      return NextResponse.json(
        {
          success: false,
          error: 'PARSE_VALIDATION_FAILED',
          message: "Couldn't understand that clearly. Please try again or fill the form manually.",
        },
        { status: 422 },
      );
    }

    const profile: Partial<CitizenProfile> = validation.data;

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('Error with Gemini voice parsing:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to parse text via AI',
      details: error?.message || String(error)
    }, { status: 500 });
  }
}