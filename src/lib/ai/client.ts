/**
 * LLM client boundary.
 *
 * Phase 1 ships mock-only. When ANTHROPIC_API_KEY is set, `generate()` should
 * call the Claude Messages API (recommended default model: claude-sonnet-4-6,
 * or claude-opus-4-8 for the highest quality). Until then callers fall back to
 * each agent's mock output. Keeping this boundary tiny lets us swap providers
 * without touching the agents.
 */
export function isLLMConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function generate(_prompt: string): Promise<string> {
  if (!isLLMConfigured()) {
    throw new Error("LLM not configured — callers should use mock output.");
  }
  // TODO Phase 5: POST https://api.anthropic.com/v1/messages with the prompt.
  throw new Error("Live LLM generation not implemented yet (Phase 5).");
}
