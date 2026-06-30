import type { Agent, AgentResult, BookContext } from "./types";

/** Generates FAQs and chat-style answers grounded in the book content. */
export const communityAgent: Agent = {
  id: "community",
  name: "Community Agent",
  description: "Creates a reader FAQ and chat-style answers from your book content.",
  outputs: ["Reader FAQ", "Sample chat answers"],
  phase: 1,

  async run(book: BookContext): Promise<AgentResult> {
    const subject = book.title || "your book";
    return {
      agentId: "community",
      mocked: true,
      assets: {
        faq: [
          `FAQ for "${subject}":`,
          "Q: What format is the book available in? A: Digital download after purchase.",
          "Q: How can I pay? A: Card via Stripe or USDC on Base.",
          "Q: Is the author verified? A: Yes — authorship is registered on-chain.",
        ].join("\n"),
        chat: [
          `Reader: What is "${subject}" about?`,
          `Agent: ${book.description ?? "It's a story crafted to keep you turning pages."}`,
          "Reader: Who is it for?",
          "Agent: Anyone who loves fresh, independent storytelling.",
        ].join("\n"),
      },
    };
  },
};
