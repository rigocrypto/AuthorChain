import type { Agent, AgentResult, BookContext } from "./types";

/** Generates sales/marketing copy: blurb, long description, social, email. */
export const copyAgent: Agent = {
  id: "copy",
  name: "Copy Agent",
  description: "Writes your blurb, book description, social posts, and email copy.",
  outputs: ["Back-cover blurb", "Store description", "Social posts (x3)", "Launch email"],
  phase: 1,

  async run(book: BookContext): Promise<AgentResult> {
    // Phase 1: deterministic mock. Phase 5 swaps in a Claude call.
    const subject = book.title || "your book";
    return {
      agentId: "copy",
      mocked: true,
      assets: {
        blurb: `A gripping new release: "${subject}". ${
          book.description ?? "A story readers won't put down."
        }`,
        description: `${subject} is a must-read for fans of bold, original storytelling. ${
          book.description ?? ""
        } Available now on AuthorChain — pay with card or USDC, with on-chain proof of authorship.`,
        social_1: `📚 Just launched "${subject}" on @AuthorChain. Own your copy, support the author directly. #Web3Publishing`,
        social_2: `New book alert: "${subject}". Instant payments, transparent royalties, real ownership.`,
        social_3: `Authors deserve better. "${subject}" is now live on AuthorChain ✨`,
        email: `Subject: "${subject}" is here!\n\nHi friend,\n\nMy new book "${subject}" just went live. Grab your copy today and get on-chain proof you were an early reader.\n\n— The Author`,
      },
    };
  },
};
