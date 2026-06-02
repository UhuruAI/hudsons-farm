import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGeminiProductImageRequest,
  extractGeminiInlineImage,
} from "./geminiProductImage.js";

test("builds a Gemini image edit request with prompt and reference image", () => {
  const body = buildGeminiProductImageRequest({
    prompt: "Create a clean product photo.",
    imageData: "abc123",
    mimeType: "image/jpeg",
  });

  assert.equal(body.contents[0].parts[0].text, "Create a clean product photo.");
  assert.deepEqual(body.contents[0].parts[1].inlineData, {
    mimeType: "image/jpeg",
    data: "abc123",
  });
  assert.equal(body.generationConfig.responseModalities[0], "TEXT");
  assert.equal(body.generationConfig.responseModalities[1], "IMAGE");
  assert.equal(body.generationConfig.imageConfig.aspectRatio, "1:1");
  assert.equal(body.generationConfig.imageConfig.imageSize, "1K");
});

test("extracts first generated inline image from Gemini response", () => {
  const image = extractGeminiInlineImage({
    candidates: [
      {
        content: {
          parts: [
            { text: "Here is the image." },
            { inlineData: { mimeType: "image/png", data: "generated" } },
          ],
        },
      },
    ],
  });

  assert.deepEqual(image, { mimeType: "image/png", data: "generated" });
});

test("returns null when Gemini response has no inline image", () => {
  const image = extractGeminiInlineImage({
    candidates: [{ content: { parts: [{ text: "No image generated." }] } }],
  });

  assert.equal(image, null);
});
