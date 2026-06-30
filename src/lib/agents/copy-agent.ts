import type { AgentDefinition, AgentInput } from "./types";

export const copyAgent: AgentDefinition = {
  id: "copy",
  name: "Copy Agent",
  description: "Writes your blurb, description, social posts, emails, and keywords.",
  fields: [
    { name: "title", label: "Book title", type: "text", required: true, placeholder: "The Quantum Prison" },
    { name: "subtitle", label: "Subtitle", type: "text", placeholder: "Escape is only the beginning" },
    { name: "description", label: "Description", type: "textarea", required: true, placeholder: "What is your book about?" },
    { name: "category", label: "Category", type: "text", placeholder: "Sci-Fi" },
    { name: "audience", label: "Target audience", type: "text", placeholder: "Readers who love smart thrillers" },
    {
      name: "tone",
      label: "Tone",
      type: "select",
      options: ["Friendly", "Professional", "Bold", "Playful", "Inspirational"],
    },
  ],
  outputs: [
    { key: "blurb", label: "Short blurb" },
    { key: "long_description", label: "Long description" },
    { key: "social_1", label: "Social post 1" },
    { key: "social_2", label: "Social post 2" },
    { key: "social_3", label: "Social post 3" },
    { key: "social_4", label: "Social post 4" },
    { key: "social_5", label: "Social post 5" },
    { key: "email_1", label: "Email 1 — announcement" },
    { key: "email_2", label: "Email 2 — reminder" },
    { key: "email_3", label: "Email 3 — last call" },
    { key: "keywords", label: "10 keywords / tags" },
  ],

  mock(input: AgentInput) {
    const title = input.title || "your book";
    const audience = input.audience || "readers";
    const tone = input.tone || "Friendly";
    const desc = input.description || "A story readers won't put down.";
    const cat = input.category || "fiction";

    return {
      blurb: `${title}: ${desc} A standout ${cat} read for ${audience}. [tone: ${tone}]`,
      long_description: `${title} is a must-read for ${audience}. ${desc} Written to grip you from the first page, it's available now on AuthorChain — pay with card or USDC, with on-chain proof of authorship.`,
      social_1: `📚 "${title}" is here. ${desc} #Web3Publishing`,
      social_2: `New release for ${audience}: "${title}". Own your copy, support the author directly.`,
      social_3: `If you love ${cat}, "${title}" belongs on your list. ✨`,
      social_4: `Behind "${title}": built for ${audience}, written to last. Read it on AuthorChain.`,
      social_5: `Instant payments. Transparent royalties. Real ownership. Get "${title}" today.`,
      email_1: `Subject: "${title}" is live!\n\nHi friend,\n\nMy new book "${title}" just launched. ${desc}\n\nGrab your copy and get on-chain proof you were an early reader.\n\n— The Author`,
      email_2: `Subject: Have you read "${title}" yet?\n\nQuick reminder that "${title}" is out now. Perfect for ${audience}. Read it on AuthorChain — card or USDC, no wallet required.`,
      email_3: `Subject: Last call for "${title}"\n\nFinal nudge — "${title}" is waiting for you. Tap below to read it today.`,
      keywords: `${cat}, ${title.toLowerCase()}, indie author, web3 publishing, ebook, digital ownership, USDC, ${audience.toLowerCase()}, AuthorChain, must-read`,
    };
  },

  buildPrompt(input: AgentInput) {
    return [
      "You are a book marketing copywriter. Using the details below, produce:",
      "a short blurb, a long store description, 5 distinct social posts, 3 launch",
      "emails (announcement, reminder, last call), and 10 keywords.",
      `Title: ${input.title}`,
      `Subtitle: ${input.subtitle ?? ""}`,
      `Description: ${input.description}`,
      `Category: ${input.category ?? ""}`,
      `Audience: ${input.audience ?? ""}`,
      `Tone: ${input.tone ?? "Friendly"}`,
    ].join("\n");
  },
};
