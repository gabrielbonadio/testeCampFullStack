"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
class AuthService {
    async login(input) {
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                login: input.login,
                deletedAt: null,
            },
        });
        if (!user) {
            return null;
        }
        const ok = await bcrypt_1.default.compare(input.password, user.password);
        if (!ok) {
            return null;
        }
        const secret = process.env["JWT_SECRET"];
        if (!secret) {
            throw new Error("JWT_SECRET não configurado");
        }
        const token = jsonwebtoken_1.default.sign({}, secret, {
            subject: user.id,
            expiresIn: "1d",
        });
        return {
            token,
            user: {
                id: user.id,
                cpf: user.cpf,
                rg: user.rg,
                name: user.name,
                age: user.age,
                email: user.email,
                login: user.login,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    }
}
exports.AuthService = AuthService;
