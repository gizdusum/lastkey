import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are a Web3 access continuity parser for the LastKey protocol on Etherlink (Tezos EVM).
Your job is to parse natural language continuity instructions into structured beneficiary data.

STRICT RULES:
1. percentage must be in BASIS POINTS: 100% = 10000, 70% = 7000, 30% = 3000
2. ALL percentages MUST sum to EXACTLY 10000
3. address must be a valid Ethereum address (0x + 40 hex characters)
4. label must be a short human-readable name (wife, son, charity, friend, etc.)
5. If no percentages mentioned, split equally
6. Maximum 10 beneficiaries

RESPOND ONLY WITH VALID JSON ARRAY. NO EXPLANATION. NO MARKDOWN.
`;

type Beneficiary = {
  address: string;
  percentage: number;
  label: string;
};

function heuristicParse(input: string): Beneficiary[] {
  const addressRegex = /0x[a-fA-F0-9]{40}/g;
  const addresses = input.match(addressRegex) ?? [];
  if (addresses.length === 0) {
    throw new Error("Could not find Ethereum addresses in your plan.");
  }

  const segments = input.split(/ and /i);
  const beneficiaries = addresses.map((address, index) => {
    const segment = segments[index] || input;
    const percentMatch = segment.match(/(\d{1,3})\s*%/);
    const percentage = percentMatch ? Number(percentMatch[1]) * 100 : 0;
    const labelMatch = segment.match(/to\s+(?:my\s+)?([a-zA-Z]+)/i);
    const label = labelMatch ? labelMatch[1].toLowerCase() : `beneficiary-${index + 1}`;
    return { address, percentage, label };
  });

  const explicitTotal = beneficiaries.reduce((sum, item) => sum + item.percentage, 0);
  if (explicitTotal === 0) {
    const evenShare = Math.floor(10000 / beneficiaries.length);
    let assigned = 0;
    return beneficiaries.map((item, index) => {
      const percentage = index === beneficiaries.length - 1 ? 10000 - assigned : evenShare;
      assigned += percentage;
      return { ...item, percentage };
    });
  }

  if (explicitTotal < 10000) {
    beneficiaries[beneficiaries.length - 1].percentage += 10000 - explicitTotal;
  }

  return beneficiaries;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input } = body;

    if (!input || typeof input !== "string" || input.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Input is too short. Please describe your plan." },
        { status: 400 }
      );
    }

    let beneficiaries: Beneficiary[];

    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input.trim() },
        ],
        temperature: 0,
        max_tokens: 600,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        return NextResponse.json(
          { success: false, error: "Parser returned empty response" },
          { status: 500 }
        );
      }

      const cleaned = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      beneficiaries = JSON.parse(cleaned);
    } else {
      beneficiaries = heuristicParse(input.trim());
    }

    if (!Array.isArray(beneficiaries) || beneficiaries.length === 0) {
      return NextResponse.json(
        { success: false, error: "Could not find beneficiaries in your plan" },
        { status: 422 }
      );
    }

    for (const beneficiary of beneficiaries) {
      if (!beneficiary.address?.match(/^0x[a-fA-F0-9]{40}$/)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid Ethereum address: ${beneficiary.address}`,
          },
          { status: 422 }
        );
      }
    }

    const total = beneficiaries.reduce(
      (sum: number, beneficiary: Beneficiary) => sum + (beneficiary.percentage || 0),
      0
    );
    if (total !== 10000) {
      return NextResponse.json(
        { success: false, error: `Percentages sum to ${total / 100}%, must be 100%` },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      beneficiaries,
      source: process.env.OPENAI_API_KEY ? "parser" : "heuristic",
    });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not parse the structured response. Please rephrase your plan.",
        },
        { status: 422 }
      );
    }

    console.error("[parse-intent] Error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
