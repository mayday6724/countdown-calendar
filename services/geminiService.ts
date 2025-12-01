import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CardContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using standard flash for text to be fast and cost-effective
const TEXT_MODEL = "gemini-2.5-flash";
// Using the image preview model for high quality results as requested
const IMAGE_MODEL = "gemini-2.5-flash-image"; 

const CARD_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    quoteJp: { type: Type.STRING, description: "The EXACT, verbatim quote in Japanese from the source material. Do not change a single word." },
    quoteZh: { type: Type.STRING, description: "The professional translation of the quote into Traditional Chinese." },
    source: { type: Type.STRING, description: "The specific author, character name, or celebrity who said this." },
    workTitle: { type: Type.STRING, description: "The specific title of the Anime (e.g., Frieren), Book, Drama, or Song." },
    imagePrompt: { type: Type.STRING, description: "A detailed description for an AI image generator to create a Japanese 'air-style' photo related to the quote and Christmas." },
  },
  required: ["quoteJp", "quoteZh", "source", "workTitle", "imagePrompt"],
};

export const generateCardContent = async (
  day: number,
  userDescription: string
): Promise<CardContent> => {
  try {
    const isChristmas = day === 25;
    
    // 1. Generate Text Content and Image Prompt
    // CRITICAL UPDATE: Instructions emphasize selection/curation over generation to ensure quotes are real.
    const systemInstruction = `
      You are a strict and knowledgeable "Literary Curator" for a Christmas Advent Calendar.
      
      Your Goal: specific a REAL, EXISTING quote that encourages the user based on their profile.
      User Profile: "${userDescription}"

      CRITICAL RULES:
      1.  **NO FAKE QUOTES:** You must NOT generate or invent a sentence. You must select an existing quote from reality.
      2.  **SOURCES:** Prioritize these sources:
          -   Anime: "Frieren: Beyond Journey's End" (葬送のフリーレン) - *Highly Preferred*
          -   Classic Japanese Literature (Haruki Murakami, Natsume Soseki, Banana Yoshimoto)
          -   Famous Japanese Dramas (e.g., "First Love", "Silent", "Quartet", "Long Vacation")
          -   Global Classics (The Little Prince, Moomins)
          -   Renowned Celebrities/Philosophers.
      3.  **THEME:** The quote must acknowledge the user's hard work (from their profile), offer gentle comfort, or provide a hopeful direction for the future.
      4.  **ATMOSPHERE:** Emo, sentimental, warm, "Japanese Air Style" (空気感).
      5.  **LANGUAGE:** Provide the original Japanese text (verbatim) and a beautiful Traditional Chinese translation.

      Image Style Guide:
      -   "Japanese Photography Magazine" style (e.g., Rinko Kawauchi style).
      -   Keywords: Overexposed, soft focus, natural light, film grain, cyan & warm tones, minimal, breathing space.
      -   Subject: Subtle Christmas elements (a single ornament, light through a window, snow on a leaf) combined with the emotion of the quote.
    `;

    const textResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `Find a real quote for Day ${day} of the advent calendar.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: CARD_SCHEMA,
        temperature: 0.8, // Slightly lower temperature to reduce hallucination risks
      },
    });

    const data = JSON.parse(textResponse.text || "{}");

    // 2. Generate Image based on the prompt
    // We append specific stylistic keywords to ensure consistency
    const stylisticSuffix = "Japanese photography style, airy aesthetic, soft lighting, film grain, Hasselblad, overexposed highlights, emotional atmosphere, high quality, 8k, photorealistic but artistic";
    const finalImagePrompt = `${data.imagePrompt}, ${stylisticSuffix}`;

    const imageResponse = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [
          { text: finalImagePrompt }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4", 
        }
      }
    });

    let imageUrl = "https://picsum.photos/600/800"; // Fallback
    
    // Iterate to find the image part
    if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
            }
        }
    }

    return {
      imageUrl,
      quoteJp: data.quoteJp,
      quoteZh: data.quoteZh,
      source: data.source,
      workTitle: data.workTitle
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data (Safe, real quotes)
    return {
      imageUrl: "https://images.unsplash.com/photo-1482638202371-aa1c17ffb50b?q=80&w=600&auto=format&fit=crop",
      quoteJp: "一番大切なものは、目に見えない。",
      quoteZh: "真正重要的東西，是用眼睛看不見的。",
      source: "Saint-Exupéry",
      workTitle: "The Little Prince"
    };
  }
};