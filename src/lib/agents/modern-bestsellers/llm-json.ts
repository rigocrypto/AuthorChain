/**
 * Minimal live JSON completion via existing env keys.
 * No new npm dependencies — uses fetch against OpenAI or Anthropic HTTP APIs.
 * Never logs keys or full prompts in returned errors.
 */

import { isLiveConfigured } from "@/lib/agents/provider";

export type LlmJsonResult =
  | { ok: true; text: string; providerName: string }
  | { ok: false; error: string };

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

function safeProviderError(): string {
  return "Market report generation failed. Please try again in a moment.";
}

async function callOpenAI(
  system: string,
  user: string,
  apiKey: string,
): Promise<LlmJsonResult> {
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    return { ok: false, error: safeProviderError() };
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    return { ok: false, error: safeProviderError() };
  }
  return { ok: true, text, providerName: `OpenAI (${model})` };
}

async function callAnthropic(
  system: string,
  user: string,
  apiKey: string,
): Promise<LlmJsonResult> {
  const model =
    process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-haiku-latest";
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: 0.5,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) {
    return { ok: false, error: safeProviderError() };
  }

  const data = (await res.json()) as {
    content?: { type?: string; text?: string }[];
  };
  const text = data.content
    ?.filter((b) => b.type === "text" && b.text)
    .map((b) => b.text)
    .join("\n")
    .trim();
  if (!text) {
    return { ok: false, error: safeProviderError() };
  }
  return { ok: true, text, providerName: `Anthropic (${model})` };
}

/**
 * Complete a JSON-oriented chat. Prefers OpenAI if both keys exist.
 * Returns a safe error when no live key is configured (does not mock as AI).
 */
export async function completeJsonChat(
  system: string,
  user: string,
): Promise<LlmJsonResult> {
  if (!isLiveConfigured()) {
    return {
      ok: false,
      error:
        "AI provider is not configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY to generate market reports.",
    };
  }

  try {
    const openai = process.env.OPENAI_API_KEY?.trim();
    if (openai) {
      return await callOpenAI(system, user, openai);
    }
    const anthropic = process.env.ANTHROPIC_API_KEY?.trim();
    if (anthropic) {
      return await callAnthropic(system, user, anthropic);
    }
    return {
      ok: false,
      error:
        "AI provider is not configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY to generate market reports.",
    };
  } catch {
    return { ok: false, error: safeProviderError() };
  }
}

/** Strip optional markdown fences before JSON.parse. */
export function extractJsonObject(raw: string): unknown {
  let text = raw.trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    text = fenced[1].trim();
  }
  return JSON.parse(text) as unknown;
}
