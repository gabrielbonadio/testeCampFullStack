import { prisma } from "../../lib/prisma";
import { HttpError } from "../../shared/errors";

type CreateOrderInput = {
  userId: string;
  description: string;
};

export class OrdersService {
  async create(input: CreateOrderInput) {
    const user = await prisma.user.findFirst({
      where: { id: input.userId, deletedAt: null },
      select: { id: true },
    });
    if (!user) {
      throw new HttpError(401, "Usuário não autenticado");
    }

    const order = await prisma.order.create({
      data: {
        description: input.description,
        userId: input.userId,
      },
    });

    return order;
  }

  async listAll() {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return orders;
  }

  async listByUser(userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true },
    });
    if (!user) {
      throw new HttpError(404, "Usuário não encontrado");
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  }
}

