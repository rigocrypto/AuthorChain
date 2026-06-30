import type { AgentDefinition, AgentInput } from "./types";

export const launchAgent: AgentDefinition = {
  id: "launch",
  name: "Launch Agent",
  description: "Builds a 14-day launch calendar, checklists, and a pricing strategy.",
  fields: [
    { name: "title", label: "Book title", type: "text", required: true, placeholder: "The Quantum Prison" },
    { name: "category", label: "Category", type: "text", placeholder: "Sci-Fi" },
    { name: "launchDate", label: "Launch date", type: "text", placeholder: "2026-07-15" },
    { name: "goal", label: "Author goal", type: "text", placeholder: "Sell 500 copies in month 1" },
    { name: "audience", label: "Target audience", type: "text", placeholder: "Sci-fi thriller readers" },
  ],
  outputs: [
    { key: "calendar", label: "14-day launch calendar" },
    { key: "prelaunch", label: "Pre-launch checklist" },
    { key: "launch_day", label: "Launch day plan" },
    { key: "postlaunch", label: "Post-launch promotion ideas" },
    { key: "pricing", label: "Suggested pricing strategy" },
  ],

  mock(input: AgentInput) {
    const title = input.title || "your book";
    const date = input.launchDate || "launch day";
    const goal = input.goal || "build momentum";
    const audience = input.audience || "your readers";

    const calendar = Array.from({ length: 14 }, (_, i) => {
      const day = i + 1;
      const phase =
        day <= 4 ? "Tease" : day <= 9 ? "Build-up" : day <= 11 ? "Launch" : "Momentum";
      return `Day ${day} (${phase}): ${
        phase === "Tease"
          ? `Share a hook about "${title}".`
          : phase === "Build-up"
            ? "Post an excerpt + author note."
            : phase === "Launch"
              ? "Announce + share the buy link (card + USDC)."
              : "Reader reviews + behind-the-scenes."
      }`;
    }).join("\n");

    return {
      calendar,
      prelaunch: [
        `Pre-launch checklist for "${title}" (target: ${date}):`,
        "□ Finalize cover + sales page copy.",
        "□ Set price and royalty %.",
        "□ Register proof of authorship on Base.",
        "□ Draft announcement emails + social posts.",
        `□ Warm up ${audience} 48h before launch.`,
      ].join("\n"),
      launch_day: [
        `Launch day plan (${date}):`,
        "1. Publish the book and confirm the buy link works.",
        "2. Send announcement email to your list.",
        "3. Post across social channels with the buy link.",
        "4. Engage every comment within the first 3 hours.",
      ].join("\n"),
      postlaunch: [
        "Post-launch promotion ideas:",
        "• Share reader reviews and quotes.",
        "• Run a 48h discount or bundle.",
        "• Guest post / podcast outreach.",
        "• Re-target people who clicked but didn't buy.",
      ].join("\n"),
      pricing: `Suggested pricing for "${title}": launch at an accessible price to hit "${goal}", then test a small increase after the first 100 sales. Consider a limited launch-week discount to reward early ${audience}.`,
    };
  },

  buildPrompt(input: AgentInput) {
    return [
      "You are a book launch strategist. Produce a 14-day launch calendar, a",
      "pre-launch checklist, a launch-day plan, post-launch promo ideas, and a",
      "pricing strategy for the book below.",
      `Title: ${input.title}`,
      `Category: ${input.category ?? ""}`,
      `Launch date: ${input.launchDate ?? ""}`,
      `Goal: ${input.goal ?? ""}`,
      `Audience: ${input.audience ?? ""}`,
    ].join("\n");
  },
};
