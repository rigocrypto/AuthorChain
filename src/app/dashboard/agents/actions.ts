"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAuthor } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { getAgent, runAgent, type AgentId, type AgentResult } from "@/lib/agents";
import { saveAgentOutput } from "@/lib/data/agent-outputs";

export type GenerateState = {
  result?: AgentResult & { bookTitle: string };
  error?: string;
};

export async function generateAgentAction(
  _prev: GenerateState,
  formData: FormData,
): Promise<GenerateState> {
  const author = await getCurrentAuthor();

  const agentId = String(formData.get("agentId") ?? "") as AgentId;
  const bookId = String(formData.get("bookId") ?? "");

  const agent = getAgent(agentId);
  if (!agent) return { error: "Unknown agent." };
  if (!bookId) return { error: "Select a book first." };

  // Verify the book belongs to the current author.
  const book = await prisma.book.findFirst({
    where: { id: bookId, authorId: author.id },
    select: { id: true, title: true },
  });
  if (!book) return { error: "Book not found." };

  // Collect declared fields from the form; validate required ones.
  const input: Record<string, string> = {};
  for (const field of agent.fields) {
    const value = String(formData.get(field.name) ?? "").trim();
    if (field.required && !value) {
      return { error: `${field.label} is required.` };
    }
    input[field.name] = value;
  }

  let result: AgentResult;
  try {
    result = await runAgent(agentId, input);
  } catch {
    return { error: "Generation failed. Please try again." };
  }

  await saveAgentOutput({
    bookId: book.id,
    authorId: author.id,
    agentId,
    input,
    assets: result.assets,
    mocked: result.mocked,
    providerName: result.providerName,
  });

  revalidatePath("/dashboard/agents");
  return { result: { ...result, bookTitle: book.title } };
}
