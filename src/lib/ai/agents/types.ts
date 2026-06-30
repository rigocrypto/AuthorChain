/** Minimal context an agent needs about a book to generate assets. */
export type BookContext = {
  title: string;
  description?: string;
  /** Optional excerpt / sample chapter used to ground community answers. */
  content?: string;
};

export type AgentResult = {
  agentId: string;
  /** Map of asset name -> generated text (e.g. "blurb", "tweet"). */
  assets: Record<string, string>;
  /** True when produced by mock fallback rather than a live model. */
  mocked: boolean;
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  /** Human-readable list of what this agent produces (for the UI). */
  outputs: string[];
  /** Phase this agent ships in (1 = active now, 2 = coming soon). */
  phase: 1 | 2;
  /** True for Phase-2 agents shown as previews without a run() yet. */
  comingSoon?: boolean;
  /** Present for active agents; absent for coming-soon previews. */
  run?: (book: BookContext) => Promise<AgentResult>;
};
