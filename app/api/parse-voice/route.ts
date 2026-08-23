import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { CitizenProfile } from '../../../types/scheme';

// Initialize the official Google Gen AI SDK client using your environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'No text provided' }, { status: 400 });
    }

    const prompt = `You are an expert Indian Government Data Extraction Engine.
Analyze the following citizen transcript (which may be in Hindi, Tamil, Telugu, Marathi, Bengali, or English) and extract the profile fields.

Return ONLY a raw JSON object matching this exact schema, with no markdown code blocks (no \`\`\`json), no conversational filler, and no extra text:
{
  "age": number (default to 25 if not mentioned),
  "annualIncome": number in INR (convert regional/colloquial terms like "5 lakh" to 500000, "50 thousand" to 50000),
  "casteCategory": "General" | "OBC" | "SC" | "ST" (infer if mentioned, default to "General"),
  "gender": "Male" | "Female" | "Other" (infer from context, default to "Male"),
  "occupation": string (e.g., "Farmer", "Student", "Laborer", "Unemployed"),
  "state": string (exact Indian state name, e.g., "Madhya Pradesh", "Uttar Pradesh", "Maharashtra", "Tamil Nadu"),
  "landholdingAcres": number (convert local units or acres to a float number, default to 0),
  "isBPLCardHolder": boolean (true if they mention BPL, ration card, or poverty line),
  "isDisabled": boolean (true if disability is mentioned)
}

Transcript to parse: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const responseText = response.text ? response.text.trim() : '';

    // Sanitize output to remove markdown ticks if the model includes them
    const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const profile: Partial<CitizenProfile> = JSON.parse(cleanJsonText);

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