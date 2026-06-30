import type { AgentDefinition, AgentInput } from "./types";

export const communityAgent: AgentDefinition = {
  id: "community",
  name: "Community Agent",
  description: "Creates a reader FAQ, discussion questions, and engagement posts.",
  fields: [
    { name: "title", label: "Book title", type: "text", required: true, placeholder: "The Quantum Prison" },
    { name: "description", label: "Description", type: "textarea", required: true, placeholder: "What is your book about?" },
    { name: "excerpt", label: "Excerpt or summary", type: "textarea", placeholder: "Paste a short excerpt or summary (optional)" },
  ],
  outputs: [
    { key: "faq", label: "Reader FAQ" },
    { key: "discussion", label: "Discussion questions" },
    { key: "posts", label: "Community post ideas" },
    { key: "engagement", label: "Reader engagement messages" },
  ],

  mock(input: AgentInput) {
    const title = input.title || "this book";
    const desc = input.description || "A story crafted to keep you turning pages.";
    const excerpt = input.excerpt?.trim();

    return {
      faq: [
        `FAQ for "${title}":`,
        `Q: What is "${title}" about? A: ${desc}`,
        "Q: What format is it in? A: Digital download after purchase.",
        "Q: How can I pay? A: Card via Stripe or USDC on Base — no wallet required.",
        "Q: Is the author verified? A: Yes — authorship is registered on-chain.",
      ].join("\n"),
      discussion: [
        `Discussion questions for "${title}":`,
        "1. Which moment surprised you the most, and why?",
        "2. How did the central conflict change your view by the end?",
        "3. Which character did you relate to, and what would you have done differently?",
        excerpt
          ? `4. The excerpt opens with: "${excerpt.slice(0, 80)}…" — what did it make you expect?`
          : "4. What theme stayed with you after finishing?",
      ].join("\n"),
      posts: [
        "Community post ideas:",
        `• Poll: "Which character in ${title} did you trust?"`,
        "• Share a favorite line and ask readers for theirs.",
        "• Behind-the-scenes: why you wrote this book.",
        "• Reader spotlight: repost a review with thanks.",
      ].join("\n"),
      engagement: [
        "Reader engagement messages:",
        `• "Thanks for reading ${title} — what did you think of the ending?"`,
        "• \"Loved having you here. Want a heads-up on the next book?\"",
        "• \"Your review helps other readers find this — would you leave one?\"",
      ].join("\n"),
    };
  },

  buildPrompt(input: AgentInput) {
    return [
      "You are a community manager for an author. Produce a reader FAQ,",
      "discussion questions, community post ideas, and reader engagement",
      "messages for the book below. Keep it promotional and community-focused;",
      "do not reproduce large copyrighted passages.",
      `Title: ${input.title}`,
      `Description: ${input.description}`,
      `Excerpt/summary: ${input.excerpt ?? "(none provided)"}`,
    ].join("\n");
  },
};
