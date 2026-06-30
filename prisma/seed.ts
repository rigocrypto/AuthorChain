import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_AUTHOR_EMAIL = "rigovivas71@gmail.com";

const books = [
  {
    slug: "the-quantum-prison",
    title: "The Quantum Prison",
    subtitle: "Escape is only the beginning",
    description:
      "A physicist wakes inside a simulation engineered by her own future self. To break free she must out-think the machine that knows her every move.",
    category: "Sci-Fi",
    price: 9.99,
    status: "PUBLISHED" as const,
    sales: 24,
  },
  {
    slug: "mind-of-the-future",
    title: "Mind of the Future",
    subtitle: "How tomorrow learns to think",
    description:
      "A grounded look at where artificial and human intelligence converge — and what creators should do about it now.",
    category: "Non-Fiction",
    price: 9.99,
    status: "PUBLISHED" as const,
    sales: 14,
  },
  {
    slug: "faith-and-freedom",
    title: "Faith & Freedom",
    subtitle: "Essays on conviction",
    description:
      "A collection of essays on belief, liberty, and living deliberately in a noisy world.",
    category: "Essays",
    price: 14.99,
    status: "PUBLISHED" as const,
    sales: 9,
  },
  {
    slug: "the-ultimate-ai-playbook",
    title: "The Ultimate AI Playbook",
    subtitle: "Ship faster with AI",
    description:
      "Practical patterns for building with AI agents, from prototype to production.",
    category: "Technology",
    price: 19.0,
    status: "DRAFT" as const,
    sales: 0,
  },
];

async function main() {
  // Idempotent: clear prior demo data (cascades to books/sales) so re-seeding is safe.
  const existing = await prisma.author.findUnique({
    where: { email: DEMO_AUTHOR_EMAIL },
  });
  if (existing) {
    await prisma.author.delete({ where: { id: existing.id } });
  }

  const author = await prisma.author.create({
    data: {
      name: "Rigo Vivas",
      email: DEMO_AUTHOR_EMAIL,
      walletAddress: "0x8a2c000000000000000000000000000000007f3c",
    },
  });

  for (const b of books) {
    const book = await prisma.book.create({
      data: {
        authorId: author.id,
        title: b.title,
        slug: b.slug,
        subtitle: b.subtitle,
        description: b.description,
        category: b.category,
        language: "English",
        price: new Prisma.Decimal(b.price),
        status: b.status,
      },
    });

    // Synthesize paid sales + 90% royalties so the dashboard has real numbers.
    for (let i = 0; i < b.sales; i++) {
      const sale = await prisma.sale.create({
        data: {
          bookId: book.id,
          authorId: author.id,
          buyerEmail: `0x${(1000 + i).toString(16)}reader${i}`,
          amount: new Prisma.Decimal(b.price),
          currency: "USDC",
          paymentProvider: "MOCK",
          paymentStatus: "PAID",
        },
      });
      await prisma.royalty.create({
        data: {
          saleId: sale.id,
          authorId: author.id,
          amount: new Prisma.Decimal(b.price * 0.9),
          currency: "USDC",
          status: i % 4 === 0 ? "PENDING" : "PAID",
        },
      });
    }
  }

  const count = await prisma.book.count({ where: { authorId: author.id } });
  console.log(`Seeded author "${author.name}" with ${count} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
