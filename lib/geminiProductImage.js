export function buildGeminiProductImageRequest({ prompt, imageData, mimeType }) {
  return {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: imageData,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K",
      },
    },
  };
}

export function extractGeminiInlineImage(response) {
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;

  for (const part of parts) {
    const inlineData = part?.inlineData;
    if (inlineData?.data && inlineData?.mimeType) {
      return {
        mimeType: inlineData.mimeType,
        data: inlineData.data,
      };
    }
  }

  return null;
}
