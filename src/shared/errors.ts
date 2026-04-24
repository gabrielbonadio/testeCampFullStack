import { Prisma } from "../../generated/prisma";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function toHttpError(err: unknown): HttpError {
  if (err instanceof HttpError) return err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (err.code === "P2002") {
      return new HttpError(400, "Violação de unicidade (cpf/email/login já existe)");
    }
    // P2025: Record not found
    if (err.code === "P2025") {
      return new HttpError(404, "Recurso não encontrado");
    }
  }

  return new HttpError(500, "Erro interno");
}

