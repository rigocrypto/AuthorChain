/**
 * Database client placeholder (Phase 2).
 *
 * Phase 2 introduces Prisma + PostgreSQL. This module will export a singleton
 * PrismaClient (guarded against hot-reload duplication in dev). Kept as a
 * placeholder so imports have a stable home.
 */

// TODO Phase 2:
//   import { PrismaClient } from "@prisma/client";
//   const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
//   export const prisma = globalForPrisma.prisma ?? new PrismaClient();
//   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const DATABASE_READY = false;
