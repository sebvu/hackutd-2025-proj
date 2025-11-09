import { NextResponse } from 'next/server';

type Range = { min?: number; max?: number };

type UserPreferences = {
  budget?: Range;
  model?: string;
  bodyType?: string;
  fuelType?: string;
  horsepower?: number;
  torque?: number;
  mileageCity?: Range;
  mileageHighway?: Range;
  weight?: Range;
  transmission_type?: string;
  tankSize?: number;
  acceleration?: number;
  seats?: number;
  allWheelDrive?: boolean;
  keywords?: string[];
};

// A function schema we send to OpenAI so it returns structured JSON.
const FUNCTION_SCHEMA = {
  name: 'extract_preferences',
  description: 'Return a JSON object matching UserPreferences',
  parameters: {
    type: 'object',
    properties: {
      budget: {
        type: 'object',
        properties: { min: { type: 'number' }, max: { type: 'number' } }
      },
      model: { type: 'string' },
      bodyType: { type: 'string' },
      fuelType: { type: 'string' },
      horsepower: { type: 'number' },
      torque: { type: 'number' },
      mileageCity: { type: 'object', properties: { min: { type: 'number' }, max: { type: 'number' } } },
      mileageHighway: { type: 'object', properties: { min: { type: 'number' }, max: { type: 'number' } } },
      weight: { type: 'object', properties: { min: { type: 'number' }, max: { type: 'number' } } },
      transmission_type: { type: 'string' },
      tankSize: { type: 'number' },
      acceleration: { type: 'number' },
      seats: { type: 'number' },
      allWheelDrive: { type: 'boolean' },
      keywords: { type: 'array', items: { type: 'string' } }
    }
  }
};

function normalizeRange(obj: any): Range | undefined {
  if (!obj) return undefined;
  const out: Range = {};
  if (obj.min !== undefined && obj.min !== null) out.min = Number(obj.min);
  if (obj.max !== undefined && obj.max !== null) out.max = Number(obj.max);
  return out;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string = body?.message;
    if (!message) return NextResponse.json({ error: 'message is required' }, { status: 400 });

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });

    const payload = {
      model: 'gpt-3.5-turbo-0613',
      temperature: 0,
      messages: [
        { role: 'system', content: 'You are a JSON extractor. Extract vehicle preference fields and return a JSON matching the provided function schema.' },
        { role: 'user', content: message }
      ],
      functions: [FUNCTION_SCHEMA],
      function_call: 'auto'
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'OpenAI API error', details: text }, { status: 502 });
    }

    const data = await res.json();
    const choice = data.choices?.[0];
    const funcArgs = choice?.message?.function_call?.arguments;
    let parsed: any = null;

    if (funcArgs) {
      try {
        parsed = JSON.parse(funcArgs);
      } catch (e) {
        parsed = null;
      }
    }

    // Fallback: if model didn't call the function, attempt to extract keywords only
    if (!parsed) {
      parsed = { keywords: [] } as any;
    }

    // Basic normalization to match our TypeScript type
    const prefs: UserPreferences = {
      budget: normalizeRange(parsed.budget),
      model: parsed.model,
      bodyType: parsed.bodyType,
      fuelType: parsed.fuelType,
      horsepower: parsed.horsepower !== undefined ? Number(parsed.horsepower) : undefined,
      torque: parsed.torque !== undefined ? Number(parsed.torque) : undefined,
      mileageCity: normalizeRange(parsed.mileageCity),
      mileageHighway: normalizeRange(parsed.mileageHighway),
      weight: normalizeRange(parsed.weight),
      transmission_type: parsed.transmission_type,
      tankSize: parsed.tankSize !== undefined ? Number(parsed.tankSize) : undefined,
      acceleration: parsed.acceleration !== undefined ? Number(parsed.acceleration) : undefined,
      seats: parsed.seats !== undefined ? Number(parsed.seats) : undefined,
      allWheelDrive: parsed.allWheelDrive !== undefined ? Boolean(parsed.allWheelDrive) : undefined,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.map(String) : []
    };

    return NextResponse.json({ preferences: prefs, rawModelOutput: data });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
