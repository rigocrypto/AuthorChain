import type { Agent, AgentResult, BookContext } from "./types";

/** Builds a launch plan and a promo calendar. */
export const launchAgent: Agent = {
  id: "launch",
  name: "Launch Agent",
  description: "Creates a launch plan and a week-by-week promo calendar.",
  outputs: ["Launch checklist", "4-week promo calendar"],
  phase: 1,

  async run(book: BookContext): Promise<AgentResult> {
    const subject = book.title || "your book";
    return {
      agentId: "launch",
      mocked: true,
      assets: {
        plan: [
          `Launch plan for "${subject}":`,
          "1. Set up the public sales page and confirm pricing.",
          "2. Register proof of authorship on Base.",
          "3. Run the Copy Agent and schedule announcement posts.",
          "4. Notify your email list 48h before launch.",
          "5. Go live and share the buy link across channels.",
        ].join("\n"),
        calendar: [
          "Week 1 — Teaser: cover reveal + premise.",
          "Week 2 — Build-up: share an excerpt + author note.",
          "Week 3 — Launch: announcement + buy link (card + USDC).",
          "Week 4 — Momentum: reader reviews + behind-the-scenes.",
        ].join("\n"),
      },
    };
  },
};
