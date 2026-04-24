"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const prisma_1 = require("../../lib/prisma");
const errors_1 = require("../../shared/errors");
class OrdersService {
    async create(input) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: input.userId, deletedAt: null },
            select: { id: true },
        });
        if (!user) {
            throw new errors_1.HttpError(401, "Usuário não autenticado");
        }
        const order = await prisma_1.prisma.order.create({
            data: {
                description: input.description,
                userId: input.userId,
            },
        });
        return order;
    }
    async listAll() {
        const orders = await prisma_1.prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        });
        return orders;
    }
    async listByUser(userId) {
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
            select: { id: true },
        });
        if (!user) {
            throw new errors_1.HttpError(404, "Usuário não encontrado");
        }
        const orders = await prisma_1.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return orders;
    }
}
exports.OrdersService = OrdersService;
