import { prisma } from "@/lib/db";
import type { BlockchainRegistration } from "@prisma/client";

/**
 * Data-access layer for on-chain proof-of-authorship registrations. Returns
 * plain serializable DTOs (ISO strings) so server and client components can use
 * them directly. Backed by the existing `BlockchainRegistration` model.
 */
export type RegistrationDTO = {
  id: string;
  status: "PENDING" | "REGISTERED" | "FAILED";
  chain: string;
  bookHash: string;
  contractAddress: string | null;
  transactionHash: string | null;
  createdAt: string;
};

function toDTO(r: BlockchainRegistration): RegistrationDTO {
  return {
    id: r.id,
    status: r.status,
    chain: r.chain,
    bookHash: r.bookHash,
    contractAddress: r.contractAddress,
    transactionHash: r.transactionHash,
    createdAt: r.createdAt.toISOString(),
  };
}

/** Most recent registration for a book, or null. */
export async function getRegistrationForBook(
  bookId: string,
): Promise<RegistrationDTO | null> {
  const r = await prisma.blockchainRegistration.findFirst({
    where: { bookId },
    orderBy: { createdAt: "desc" },
  });
  return r ? toDTO(r) : null;
}

export async function createPendingRegistration(input: {
  bookId: string;
  authorId: string;
  chain: string;
  bookHash: string;
}): Promise<string> {
  const r = await prisma.blockchainRegistration.create({
    data: {
      bookId: input.bookId,
      authorId: input.authorId,
      chain: input.chain,
      bookHash: input.bookHash,
      status: "PENDING",
    },
  });
  return r.id;
}

export async function markRegistered(input: {
  id: string;
  contractAddress: string | null;
  transactionHash: string;
}): Promise<void> {
  await prisma.blockchainRegistration.update({
    where: { id: input.id },
    data: {
      status: "REGISTERED",
      contractAddress: input.contractAddress,
      transactionHash: input.transactionHash,
    },
  });
}

export async function markFailed(id: string): Promise<void> {
  await prisma.blockchainRegistration.update({
    where: { id },
    data: { status: "FAILED" },
  });
}
