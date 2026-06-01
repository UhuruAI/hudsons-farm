import { GoogleGenAI } from "@google/genai";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/products");
mkdirSync(OUT_DIR, { recursive: true });

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) { console.error("GOOGLE_API_KEY not set"); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });

const products = [
  {
    slug: "ginger-molasses-biscuits",
    prompt: "Professional food photography of rustic ginger molasses biscuits, 12 biscuits arranged artfully on a dark slate board, warm amber tones, studio lighting, shallow depth of field, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "chocolate-chip-biscuits",
    prompt: "Professional food photography of classic chocolate chip cookies/biscuits, stacked and scattered on a linen cloth with a few chocolate chips around them, warm natural light, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "red-velvet-white-chocolate-biscuits",
    prompt: "Professional food photography of red velvet biscuits with white chocolate chips, deep crimson color, arranged on white marble with scattered white chocolate pieces, studio lighting, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "premium-fudgy-brownies",
    prompt: "Professional food photography of 4 dense fudgy chocolate brownies in an open kraft box, crackled top, moist interior visible on one cut piece, dark moody background, dramatic lighting, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "shallot-chilli-crunch",
    prompt: "Professional food photography of a 250ml glass jar filled with golden crispy shallot chilli oil, visible crispy shallot pieces and red chilli flakes, wooden spoon beside jar on dark stone surface, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "durban-fire-relish",
    prompt: "Professional food photography of a 250ml glass jar of vibrant deep red Durban chilli relish, rich bold color, jar open with a teaspoon resting on the lid, warm rustic setting, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "caramelised-onion-thyme-marmalade",
    prompt: "Professional food photography of a 250ml glass jar of deep amber caramelised onion and thyme marmalade, fresh thyme sprigs alongside, rustic wooden board, golden hour lighting, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "basil-almond-pesto",
    prompt: "Professional food photography of a 250ml glass jar of vibrant green basil almond pesto, fresh basil leaves and toasted almonds scattered around jar on white marble, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "strawberry-vanilla-jam",
    prompt: "Professional food photography of a 250ml glass jar of glossy strawberry vanilla jam, fresh strawberries and a vanilla pod beside it on a light linen cloth, bright airy styling, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "blueberry-jam",
    prompt: "Professional food photography of a 250ml glass jar of rich deep purple blueberry jam, fresh blueberries scattered on a white marble surface, clean minimal styling, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "roasted-pineapple-ginger-jam",
    prompt: "Professional food photography of a 250ml glass jar of golden roasted pineapple and ginger jam, caramelised color, sliced pineapple and ginger root beside it, warm tropical styling, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "signature-roasted-masala",
    prompt: "Professional food photography of a 150g kraft paper spice pouch of roasted masala blend, rich dark reddish-brown powder spilling from a small scoop onto dark stone, aromatic whole spices beside it, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "garam-masala",
    prompt: "Professional food photography of a 150g kraft paper pouch of garam masala spice blend, warm brown powder in a small wooden bowl with whole spices like cinnamon, cloves, and cardamom arranged around it, dark moody background, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "royal-biryani-masala",
    prompt: "Professional food photography of a 150g kraft paper pouch of biryani masala spice blend, vibrant mixed spices arranged in elegant composition on dark slate, star anise, bay leaves, saffron threads as garnish, 4K, magazine quality, no text, no branding",
  },
  {
    slug: "artisan-chai-spice-blend",
    prompt: "Professional food photography of a 150g kraft pouch of artisan chai spice blend, cinnamon sticks, cardamom pods, star anise, ginger slices arranged beautifully around a steaming cup of chai on dark wooden surface, 4K, magazine quality, no text, no branding",
  },
];

async function generateImage(product, index) {
  console.log(`[${index + 1}/${products.length}] Generating: ${product.slug}`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [{ role: "user", parts: [{ text: product.prompt }] }],
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith("image/"));
    if (!imagePart) throw new Error("No image in response");

    const buffer = Buffer.from(imagePart.inlineData.data, "base64");
    const outPath = join(OUT_DIR, `${product.slug}.jpg`);
    writeFileSync(outPath, buffer);
    console.log(`  ✓ Saved: public/products/${product.slug}.jpg`);
    return outPath;
  } catch (err) {
    console.error(`  ✗ Failed: ${product.slug} — ${err.message}`);
    return null;
  }
}

async function main() {
  console.log("Generating premium product images with Gemini Imagen 3...\n");
  const results = [];
  for (let i = 0; i < products.length; i++) {
    const result = await generateImage(products[i], i);
    results.push({ slug: products[i].slug, path: result });
    // Small delay to avoid rate limiting
    if (i < products.length - 1) await new Promise(r => setTimeout(r, 1500));
  }

  console.log("\n--- Summary ---");
  const ok = results.filter(r => r.path).length;
  const fail = results.filter(r => !r.path).length;
  console.log(`Done: ${ok} generated, ${fail} failed`);
  console.log("\nPublic paths:");
  results.filter(r => r.path).forEach(r => {
    console.log(`  /products/${r.slug}.jpg`);
  });
}

main().catch(console.error);
