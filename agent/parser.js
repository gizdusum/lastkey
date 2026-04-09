/**
 * DeadDrop NLP Parser
 * Doğal dil miras talimatlarını structured JSON'a dönüştürür.
 */

const OpenAI = require("openai");

const SYSTEM_PROMPT = `
You are a Web3 inheritance parser for the DeadDrop protocol on Etherlink (Tezos EVM).
Your job is to parse natural language inheritance instructions into structured beneficiary data.

STRICT RULES:
1. percentage must be in BASIS POINTS: 100% = 10000, 70% = 7000, 30% = 3000, 50% = 5000
2. ALL percentages MUST sum to EXACTLY 10000
3. address must be a valid Ethereum address (starts with 0x, 42 characters total)
4. label must be a short human-readable name (wife, son, daughter, charity, friend, etc.)
5. If percentages don't add up to 100%, assign the remainder to the last beneficiary
6. If no percentages are mentioned, split equally among all beneficiaries
7. Maximum 10 beneficiaries

RESPOND ONLY WITH VALID JSON ARRAY. NO EXPLANATION. NO MARKDOWN. NO CODE BLOCKS.
`;

async function parseInheritanceIntent(naturalLanguageInput) {
  if (!naturalLanguageInput || naturalLanguageInput.trim().length < 10) {
    return {
      success: false,
      error: "Input too short. Please describe your inheritance plan.",
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: "OPENAI_API_KEY is not configured.",
    };
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: naturalLanguageInput },
      ],
      temperature: 0,
      max_tokens: 600,
    });

    const content = response.choices[0].message.content?.trim();
    if (!content) {
      return { success: false, error: "Parser returned empty response" };
    }

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return {
        success: false,
        error: "Could not parse beneficiaries from your input",
      };
    }

    for (const b of parsed) {
      if (!b.address || !/^0x[a-fA-F0-9]{40}$/.test(b.address)) {
        return { success: false, error: `Invalid Ethereum address: ${b.address}` };
      }
      if (typeof b.percentage !== "number" || b.percentage <= 0) {
        return { success: false, error: `Invalid percentage for ${b.label}` };
      }
    }

    const total = parsed.reduce((sum, b) => sum + b.percentage, 0);
    if (total !== 10000) {
      return {
        success: false,
        error: `Percentages sum to ${total / 100}%, must be exactly 100%`,
      };
    }

    return { success: true, beneficiaries: parsed };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return {
        success: false,
        error: "Parser response was not valid JSON. Please rephrase your plan.",
      };
    }
    return { success: false, error: err.message };
  }
}

module.exports = { parseInheritanceIntent };
