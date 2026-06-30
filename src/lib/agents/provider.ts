import type { AgentProvider } from "./types";
import { mockProvider } from "./mock-provider";

/**
 * Provider selection. Today this always returns the mock provider. When a live
 * provider is implemented (Phase 5), detect its key here and return it —
 * nothing else in the app changes.
 *
 * Provider-agnostic by design: we check for any supported key, but the concrete
 * client (Claude/OpenAI/…) is intentionally NOT bundled yet to keep installs
 * light.
 */
export function isLiveConfigured(): boolean {
  return Boolean(
    process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY,
  );
}

export function getProvider(): AgentProvider {
  // TODO Phase 5: if (isLiveConfigured()) return liveProvider;
  return mockProvider;
}
