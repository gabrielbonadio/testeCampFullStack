import type { PrismaClient } from "../../generated/prisma";
import { mockDeep, mockReset } from "jest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>();

export function resetPrismaMock() {
  mockReset(prismaMock);
}

