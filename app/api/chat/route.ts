import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, cars } = await req.json();

    const prompt = `
You are a friendly car expert assistant. The user said: "${message}"

Your job:
- Infer what kind of car they want (budget, speed, seats, etc.)
- Return structured filter data (ranges) that best match their description.
- Keep the values realistic based on modern car data.

Return ONLY valid JSON in this exact schema:
{
  "filters": {
    "price": [min, max],
    "horsepower": [min, max],
    "mileage_city": [min, max],
    "mileage_highway": [min, max],
    "acceleration": [min, max],
    "seats": [min, max],
    "awd": true | false | null
  },
  "comment": "brief friendly summary explaining why you chose those filters"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a JSON-returning assistant. Return ONLY valid JSON, no text outside braces." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    });

    let raw = completion.choices[0].message?.content?.trim() ?? "";

    // ✅ Ensure response is parseable JSON
    let parsed;
    try {
      // Try direct parse
      parsed = JSON.parse(raw);
    } catch {
      // Try to extract JSON substring if model adds extra text
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback safe default
        parsed = {
          filters: {
            price: [20000, 80000],
            horsepower: [100, 400],
            mileage_city: [20, 50],
            mileage_highway: [25, 60],
            acceleration: [5, 12],
            seats: [4, 7],
            awd: null,
          },
          comment: "I couldn’t understand exactly, so here’s a general balanced filter setup.",
        };
      }
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json(
      {
        filters: {
          price: [20000, 80000],
          horsepower: [100, 400],
          mileage_city: [20, 50],
          mileage_highway: [25, 60],
          acceleration: [5, 12],
          seats: [4, 7],
          awd: null,
        },
        comment: "Something went wrong, but I applied default filters.",
      },
      { status: 200 }
    );
  }
}
