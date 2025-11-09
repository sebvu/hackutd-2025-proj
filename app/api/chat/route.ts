import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧩 Mock reviews until API arrives
const mockReviews = [
  {
    model: "Corolla",
    reviews: [
      "Amazing gas mileage, perfect for long commutes.",
      "Compact but very reliable.",
      "Not super fast but super efficient!",
    ],
    avg_rating: 4.6,
  },
  {
    model: "Camry",
    reviews: [
      "Spacious interior and very comfortable seats.",
      "Mileage is decent, smooth highway drive.",
      "A little pricey but worth it for the comfort.",
    ],
    avg_rating: 4.5,
  },
  {
    model: "RAV4",
    reviews: [
      "Great SUV for families.",
      "AWD is reliable, good storage capacity.",
      "Mileage isn’t the best, but the ride feels safe.",
    ],
    avg_rating: 4.4,
  },
  {
    model: "Highlander",
    reviews: [
      "Huge space and very family friendly.",
      "Fuel economy could be better.",
      "Excellent for long trips.",
    ],
    avg_rating: 4.3,
  },
];

export async function POST(req: Request) {
  try {
    const { message, cars } = await req.json();

    // 🔹 System Prompt
    const prompt = `
You are Matchmaker, a friendly car expert assistant for a car browsing app.

The user said: "${message}"

You can chat casually, or if they describe a type of car they want, 
adjust the filters accordingly.

Here’s the list of available cars:
${cars.map((c: any) => c.model).join(", ")}

And here are summarized mock reviews for each:
${mockReviews
  .map(
    (r) =>
      `${r.model} (avg ${r.avg_rating}/5): ${r.reviews
        .slice(0, 2)
        .join(" | ")}`
  )
  .join("\n")}

Return ONLY JSON in this exact schema:
{
  "type": "chat" | "filter",
  "reply": "a short, friendly message to the user",
  "filters": {
    "price": [min,max],
    "horsepower": [min,max],
    "mileage_city": [min,max],
    "mileage_highway": [min,max],
    "acceleration": [min,max],
    "seats": [min,max],
    "awd": true | false | null
  },
  "highlightedCars": ["CarModel1", "CarModel2"],
  "reviewSummary": "short summary of reviews that match user's preferences"
}

Rules:
- If message is casual, return type: "chat" and only reply.
- If message implies car preferences (budget, seats, fuel, etc.), return type: "filter".
- Be concise, friendly, and helpful.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a JSON-returning assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    });

    let raw = completion.choices[0].message?.content?.trim() ?? "";
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      else
        parsed = {
          type: "chat",
          reply: "Hmm, I didn’t quite catch that. Could you describe your car preferences again?",
          filters: {},
          highlightedCars: [],
          reviewSummary: "",
        };
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json(
      {
        type: "chat",
        reply: "Sorry, something went wrong while processing your request.",
        filters: {},
        highlightedCars: [],
        reviewSummary: "",
      },
      { status: 200 }
    );
  }
}
