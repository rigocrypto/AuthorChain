/**
 * AI agent registry.
 *
 * Each agent describes the marketing/community assets it can produce. Phase 5
 * wires these to a real LLM (Anthropic Claude); until an API key is present,
 * `run()` returns deterministic mock output so the UI is fully usable offline.
 */
import { copyAgent } from "./copy-agent";
import { launchAgent } from "./launch-agent";
import { communityAgent } from "./community-agent";
import { pricingAgent, opportunityAgent } from "./preview-agents";
import type { Agent } from "./types";

export const agentRegistry: Agent[] = [
  copyAgent,
  launchAgent,
  communityAgent,
  pricingAgent,
  opportunityAgent,
];

export function getAgent(id: string): Agent | undefined {
  return agentRegistry.find((a) => a.id === id);
}

export type { Agent } from "./types";
