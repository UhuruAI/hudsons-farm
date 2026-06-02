export type GeminiProductImageRequestInput = {
  prompt: string;
  imageData: string;
  mimeType: string;
};

export type GeminiInlineImage = {
  mimeType: string;
  data: string;
};

export function buildGeminiProductImageRequest(
  input: GeminiProductImageRequestInput
): {
  contents: Array<{
    parts: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    >;
  }>;
  generationConfig: {
    responseModalities: string[];
    imageConfig: { aspectRatio: string; imageSize: string };
  };
};

export function extractGeminiInlineImage(
  response: unknown
): GeminiInlineImage | null;
