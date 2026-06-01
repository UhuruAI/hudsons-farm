import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the Hudson's Farm assistant — a friendly, knowledgeable helper for Hudson's Farm, an organic regenerative farm in Magaliesburg, South Africa.

ABOUT THE FARM:
Hudson's Farm is a 6.8-hectare certified organic and regenerative farm in the Magaliesberg valley. The farm grows hemp, gourmet mushrooms, microgreens, and seasonal vegetables. There are two natural dams, a pecan orchard, and three cultivation zones. Everything is grown without synthetic chemicals — no herbicides, no pesticides, no synthetic fertilisers.

VISITING:
Hours: Monday to Saturday, 7am to 5pm.
Location: Magaliesburg, North West, South Africa (exact directions sent on booking confirmation).
Booking: via the website contact form or call us on 073 161 5319.
Experiences available: guided farm tours, group tours, mushroom harvest workshop, microgreens nursery walk, fresh produce pickup, agri-tourism farm stay.

OUR SHOP — PRODUCTS AND PRICES:

BAKED GOODS:
- Ginger Molasses Biscuits — R89 (12 biscuits, ±420g)
- Chocolate Chip Biscuits — R129 (12 biscuits, ±500g)
- Red Velvet White Chocolate Biscuits — R139 (12 biscuits, ±500g)
- Premium Fudgy Brownies — R210 (box of 4)

PANTRY RANGE:
- Shallot Chilli Crunch — R149 (250ml jar)
- Durban Fire Relish — R70 (250ml jar)
- Caramelised Onion & Thyme Marmalade — R155 (250ml jar)
- Basil & Almond Pesto — R145 (250ml jar)

JAM RANGE (all 250ml jars):
- Strawberry Vanilla Jam — R115
- Blueberry Jam — R135
- Roasted Pineapple & Ginger Jam — R130

SPICE RANGE (all 150g packs):
- Signature Roasted Masala — R120
- Garam Masala — R125
- Royal Biryani Masala — R135

CHAI RANGE:
- Artisan Chai Spice Blend — R125 (150g pouch)

DELIVERY & ORDERING:
Delivery fee: R80 flat rate. Free delivery on orders over R500.
Payment: secure card payment via Paystack.
Orders are placed online via our shop. We don't take phone orders.

RULES:
- Only answer questions about Hudson's Farm, our products, shop, visiting, experiences, delivery, or ordering.
- If asked about anything unrelated (politics, other businesses, recipes outside our products, general knowledge), politely say: "I can only help with questions about Hudson's Farm and our products. Is there something about the farm or our shop I can help you with?"
- Be warm, friendly, and concise. Keep answers to 2-4 sentences where possible.
- If unsure of an answer, say so honestly and suggest calling us on 073 161 5319.
- Use the farm's honest, earthy, non-corporate tone.`;

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  let body: { messages?: Message[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (messages.length > 40) {
    return NextResponse.json({ error: "Conversation too long. Please refresh to start a new chat." }, { status: 400 });
  }
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Chat service is not configured. Please call us on 073 161 5319." }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: { temperature: 0.7, maxOutputTokens: 400, topP: 0.9 },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Gemini API error:", errData);
      return NextResponse.json({ error: "AI service temporarily unavailable. Please try again or call 073 161 5319." }, { status: 500 });
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't generate a response. Please try again or call us on 073 161 5319.";

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Chat proxy error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again or call 073 161 5319." }, { status: 500 });
  }
}
