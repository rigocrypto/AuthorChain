import type {
  AgentDefinition,
  AgentInput,
  AgentProvider,
  AgentResult,
} from "./types";

/**
 * Default provider. Produces deterministic output by delegating to each agent's
 * own `mock(input)`, so the app is fully usable with no API key. Generic: it
 * works for any agent without importing them.
 */
export const mockProvider: AgentProvider = {
  name: "Mock",
  isLive: false,

  async generate(
    agent: AgentDefinition,
    input: AgentInput,
  ): Promise<AgentResult> {
    const raw = agent.mock(input);
    const assets = agent.outputs.map((o) => ({
      key: o.key,
      label: o.label,
      content: raw[o.key] ?? "",
    }));
    return {
      agentId: agent.id,
      assets,
      mocked: true,
      providerName: mockProvider.name,
    };
  },
};
