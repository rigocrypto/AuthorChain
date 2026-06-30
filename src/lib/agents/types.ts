/**
 * AI agent type contracts.
 *
 * The app depends on these types, never on a concrete AI provider. Mock mode is
 * the default; a live provider (Claude/OpenAI/etc.) can be added later by
 * implementing AgentProvider without touching agents or UI.
 */

export type AgentId = "copy" | "launch" | "community";

/** Maps an agent to the Prisma AgentType enum. */
export const AGENT_TYPE: Record<AgentId, "COPY" | "LAUNCH" | "COMMUNITY"> = {
  copy: "COPY",
  launch: "LAUNCH",
  community: "COMMUNITY",
};

export type FieldType = "text" | "textarea" | "select";

/** A single input field, used to render and validate the agent form. */
export type AgentField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

export type AgentInput = Record<string, string>;

/** One generated artifact (e.g. the blurb, or "Social post 1"). */
export type AgentAsset = {
  key: string;
  label: string;
  content: string;
};

export type AgentResult = {
  agentId: AgentId;
  assets: AgentAsset[];
  /** True when produced by the mock provider rather than a live model. */
  mocked: boolean;
  /** Display name of the provider that produced this ("Mock", "Claude", …). */
  providerName: string;
};

/**
 * An agent definition. `mock` and `buildPrompt` live with the agent so the
 * provider stays generic: the mock provider calls `mock`, a future live
 * provider calls `buildPrompt` + the model, then parses the response.
 */
export type AgentDefinition = {
  id: AgentId;
  name: string;
  description: string;
  fields: AgentField[];
  /** Output keys + labels this agent produces, in display order. */
  outputs: { key: string; label: string }[];
  /** Deterministic offline output. */
  mock: (input: AgentInput) => Record<string, string>;
  /** Prompt for a future live provider (unused in mock mode). */
  buildPrompt: (input: AgentInput) => string;
};

/** Serializable subset of an agent safe to pass to client components. */
export type AgentMeta = Pick<
  AgentDefinition,
  "id" | "name" | "description" | "fields" | "outputs"
>;

export interface AgentProvider {
  /** Human-readable provider name shown in the UI. */
  name: string;
  /** False for mock; true once a real model is wired up. */
  isLive: boolean;
  generate: (
    agent: AgentDefinition,
    input: AgentInput,
  ) => Promise<AgentResult>;
}
