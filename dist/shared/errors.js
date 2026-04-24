"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.toHttpError = toHttpError;
const client_1 = require("../../generated/prisma/client");
class HttpError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.HttpError = HttpError;
function toHttpError(err) {
    if (err instanceof HttpError)
        return err;
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
