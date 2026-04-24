"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../lib/prisma");
const errors_1 = require("../../shared/errors");
class UsersService {
    async create(input) {
        const passwordHash = await bcrypt_1.default.hash(input.password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                cpf: input.cpf,
                rg: input.rg,
                name: input.name,
                age: input.age,
                email: input.email,
                login: input.login,
                password: passwordHash,
            },
            select: {
                id: true,
                cpf: true,
                rg: true,
                name: true,
                age: true,
                email: true,
                login: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });
        return user;
    }
    async update(id, input) {
        const data = {};
        if (typeof input.cpf === "string")
            data.cpf = input.cpf;
        if (typeof input.rg === "string")
            data.rg = input.rg;
        if (typeof input.name === "string")
            data.name = input.name;
        if (typeof input.age === "number")
            data.age = input.age;
        if (typeof input.email === "string")
            data.email = input.email;
        if (typeof input.login === "string")
            data.login = input.login;
        if (typeof input.password === "string")
            data.password = await bcrypt_1.default.hash(input.password, 10);
        // Não atualiza usuário deletado e evita exceção (P2025) usando updateMany.
        const { count } = await prisma_1.prisma.user.updateMany({
            where: { id, deletedAt: null },
            data,
        });
        if (count === 0) {
            throw new errors_1.HttpError(404, "Usuário não encontrado");
        }
        const user = await prisma_1.prisma.user.findFirst({
            where: { id },
            select: {
                id: true,
                cpf: true,
                rg: true,
                name: true,
                age: true,
                email: true,
                login: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });
        return user;
    }
    async softDelete(id) {
        const now = new Date();
        const { count } = await prisma_1.prisma.user.updateMany({
            where: { id, deletedAt: null },
            data: { deletedAt: now },
        });
        if (count === 0) {
            throw new errors_1.HttpError(404, "Usuário não encontrado");
        }
        return { id, deletedAt: now };
    }
    async list() {
        const users = await prisma_1.prisma.user.findMany({
            where: { deletedAt: null },
            select: {
                id: true,
                cpf: true,
                rg: true,
                name: true,
                age: true,
                email: true,
                login: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return users;
    }
}
exports.UsersService = UsersService;
