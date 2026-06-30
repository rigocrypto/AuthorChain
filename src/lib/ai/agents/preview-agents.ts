import type { Agent } from "./types";

/**
 * Phase-2 agents shown as previews on the AI Agents page. They have no run()
 * yet — they ship in the Growth Intelligence Layer once analytics data exists.
 */
export const pricingAgent: Agent = {
  id: "pricing",
  name: "Pricing Agent",
  description: "Suggests the best price based on real sales and conversion data.",
  outputs: ["Price recommendation", "Confidence score", "Suggested promo"],
  phase: 2,
  comingSoon: true,
};

export const opportunityAgent: Agent = {
  id: "opportunity",
  name: "Opportunity Agent",
  description: "Finds trends, keywords, and market opportunities for your books.",
  outputs: ["Category trends", "Keyword opportunities", "Cross-sell ideas"],
  phase: 2,
  comingSoon: true,
};
