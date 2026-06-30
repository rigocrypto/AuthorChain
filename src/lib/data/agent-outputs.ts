import { prisma } from "@/lib/db";
import { AGENT_TYPE, type AgentId, type AgentAsset } from "@/lib/agents";

/**
 * Persistence for AI agent runs. Inputs and the generated assets are stored as
 * JSON strings in the AgentOutput table.
 */
export async function saveAgentOutput(params: {
  bookId: string;
  authorId: string;
  agentId: AgentId;
  input: Record<string, string>;
  assets: AgentAsset[];
  mocked: boolean;
  providerName: string;
}): Promise<void> {
  await prisma.agentOutput.create({
    data: {
      bookId: params.bookId,
      authorId: params.authorId,
      agentType: AGENT_TYPE[params.agentId],
      input: JSON.stringify(params.input),
      output: JSON.stringify({
        assets: params.assets,
        mocked: params.mocked,
        providerName: params.providerName,
      }),
    },
  });
}

export type AgentOutputDTO = {
  id: string;
  agentType: string;
  bookTitle: string;
  assets: AgentAsset[];
  mocked: boolean;
  providerName: string;
  createdAt: string;
};

export async function listAgentOutputs(
  authorId: string,
  limit = 20,
): Promise<AgentOutputDTO[]> {
  const rows = await prisma.agentOutput.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { book: { select: { title: true } } },
  });

  return rows.map((r) => {
    let assets: AgentAsset[] = [];
    let mocked = true;
    let providerName = "Mock";
    try {
      const parsed = JSON.parse(r.output);
      assets = parsed.assets ?? [];
      mocked = parsed.mocked ?? true;
      providerName = parsed.providerName ?? "Mock";
    } catch {
      // Tolerate legacy/corrupt rows rather than crashing the page.
    }
    return {
      id: r.id,
      agentType: r.agentType,
      bookTitle: r.book.title,
      assets,
      mocked,
      providerName,
      createdAt: r.createdAt.toISOString().slice(0, 16).replace("T", " "),
    };
  });
}
