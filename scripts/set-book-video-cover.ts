import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient, type StorageProvider } from "@prisma/client";
import { getStorage } from "../src/lib/storage";

type Args = {
  bookQuery: string;
  filePath: string;
};

function parseArgs(argv: string[]): Args {
  let bookQuery = "Quantum Purgatory";
  let filePath = "docs/assets/Readervid.mp4";

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if ((a === "--book" || a === "-b") && argv[i + 1]) {
      bookQuery = argv[i + 1];
      i += 1;
      continue;
    }
    if ((a === "--file" || a === "-f") && argv[i + 1]) {
      filePath = argv[i + 1];
      i += 1;
      continue;
    }
  }

  return { bookQuery, filePath };
}

function currentProvider(): StorageProvider {
  switch (process.env.STORAGE_DRIVER) {
    case "s3":
      return "S3";
    case "r2":
      return "R2";
    case "ipfs":
      return "IPFS";
    case "arweave":
      return "ARWEAVE";
    default:
      return "LOCAL";
  }
}

async function main(): Promise<void> {
  const { bookQuery, filePath } = parseArgs(process.argv.slice(2));
  const prisma = new PrismaClient();

  try {
    const absoluteFile = path.resolve(process.cwd(), filePath);
    const bytes = await readFile(absoluteFile);

    const exact = await prisma.book.findFirst({
      where: {
        OR: [{ title: bookQuery }, { slug: bookQuery }],
      },
      select: { id: true, title: true, slug: true, status: true },
    });

    const book =
      exact ??
      (await prisma.book.findFirst({
        where: {
          OR: [
            { title: { contains: bookQuery, mode: "insensitive" } },
            { slug: { contains: bookQuery, mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, slug: true, status: true },
      }));

    if (!book) {
      const candidates = await prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: "quantum", mode: "insensitive" } },
            { slug: { contains: "quantum", mode: "insensitive" } },
          ],
        },
        select: { id: true, title: true, slug: true, status: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      console.error(`Book not found for query: "${bookQuery}"`);
      if (candidates.length > 0) {
        console.error("Closest matches:");
        for (const c of candidates) {
          console.error(`- ${c.title} (${c.slug}) [${c.status}] id=${c.id}`);
        }
      }
      process.exitCode = 1;
      return;
    }

    const fileName = path.basename(absoluteFile);
    if (!fileName.toLowerCase().endsWith(".mp4")) {
      console.error("Only MP4 is supported by this script.");
      process.exitCode = 1;
      return;
    }

    const stored = await getStorage().put(fileName, bytes, "video/mp4", "covers");

    await prisma.$transaction([
      prisma.bookAsset.deleteMany({
        where: { bookId: book.id, assetType: "COVER", isPrimary: true },
      }),
      prisma.bookAsset.create({
        data: {
          bookId: book.id,
          assetType: "COVER",
          storageProvider: currentProvider(),
          storageKey: stored.key,
          fileName,
          mimeType: "video/mp4",
          fileSize: stored.size,
          hash: stored.sha256,
          isPrimary: true,
        },
      }),
    ]);

    console.log(
      [
        "Video cover assigned successfully:",
        `book: ${book.title} (${book.slug})`,
        `bookId: ${book.id}`,
        `status: ${book.status}`,
        `storageKey: ${stored.key}`,
      ].join("\n"),
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
