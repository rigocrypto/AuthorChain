import { copyAgent } from "./copy-agent";
import { launchAgent } from "./launch-agent";
import { communityAgent } from "./community-agent";
import { getProvider } from "./provider";
import type { AgentDefinition, AgentId, AgentInput, AgentMeta, AgentResult } from "./types";

/** Active agents (have a working run path via the provider). */
export const agents: AgentDefinition[] = [copyAgent, launchAgent, communityAgent];

export function getAgent(id: string): AgentDefinition | undefined {
  return agents.find((a) => a.id === id);
}

/** Serializable metadata for client components (no functions). */
export function getAgentMeta(): AgentMeta[] {
  return agents.map(({ id, name, description, fields, outputs }) => ({
    id,
    name,
    description,
    fields,
    outputs,
  }));
}

/** Run an agent through the active provider (mock by default). */
export async function runAgent(
  id: AgentId,
  input: AgentInput,
): Promise<AgentResult> {
  const agent = getAgent(id);
  if (!agent) throw new Error(`Unknown agent: ${id}`);
  return getProvider().generate(agent, input);
}

/** Phase-2 agents — shown as previews only (no run path yet). */
export const previewAgents = [
  {
    id: "pricing",
    name: "Pricing Agent",
    description: "Suggests the best price based on real sales and conversion data.",
  },
  {
    id: "opportunity",
    name: "Opportunity Agent",
    description: "Finds trends, keywords, and market opportunities for your books.",
  },
] as const;

export { getProvider, isLiveConfigured } from "./provider";
export type {
  AgentId,
  AgentMeta,
  AgentResult,
  AgentInput,
  AgentField,
  AgentAsset,
} from "./types";
export { AGENT_TYPE } from "./types";
