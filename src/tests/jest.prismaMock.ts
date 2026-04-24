// Esse arquivo garante que TODOS os imports de `../lib/prisma` nos módulos
// usem o Prisma mockado durante a suíte de testes.
//
// Importante: jest.mock é hoistado, então usamos require dentro do factory.
import { jest } from "@jest/globals";

jest.mock("../lib/prisma", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { prismaMock } = require("./clientMock");
  return { prisma: prismaMock };
});

