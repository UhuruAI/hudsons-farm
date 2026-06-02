import { NextRequest, NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";
import {
  buildGeminiProductImageRequest,
  extractGeminiInlineImage,
} from "@/lib/geminiProductImage.js";

const MAX_IMAGE_DATA_LENGTH = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = convexAuthNextjsToken();
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const isAdmin = await fetchQuery(api.users.isAdmin, {}, { token });
  if (!isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  let body: { prompt?: string; imageData?: string; mimeType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  const imageData = body.imageData?.trim();
  const mimeType = body.mimeType?.trim().toLowerCase();

  if (!prompt || !imageData || !mimeType) {
    return NextResponse.json({ error: "Prompt and reference image are required" }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  if (imageData.length > MAX_IMAGE_DATA_LENGTH) {
    return NextResponse.json({ error: "Reference image is too large" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini image generation is not configured" }, { status: 500 });
  }

  try {
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(
          buildGeminiProductImageRequest({
            prompt,
            imageData,
            mimeType,
          })
        ),
      }
    );

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.json().catch(() => ({}));
      console.error("Gemini image API error:", errorBody);
      return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
    }

    const data = await geminiResponse.json();
    const image = extractGeminiInlineImage(data);
    if (!image) {
      return NextResponse.json({ error: "Gemini did not return an image" }, { status: 502 });
    }

    return NextResponse.json({
      imageDataUrl: `data:${image.mimeType};base64,${image.data}`,
      mimeType: image.mimeType,
    });
  } catch (error) {
    console.error("Product image generation error:", error);
    return NextResponse.json({ error: "Image generation is unavailable" }, { status: 500 });
  }
}
