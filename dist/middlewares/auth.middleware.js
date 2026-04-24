"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token ausente" });
    }
    const token = header.slice("Bearer ".length).trim();
    const secret = process.env["JWT_SECRET"];
    if (!secret) {
        return res.status(500).json({ message: "JWT_SECRET não configurado" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (typeof decoded !== "object" || decoded === null) {
            return res.status(401).json({ message: "Token inválido" });
        }
        const payload = decoded;
        if (typeof payload.sub !== "string" || payload.sub.trim() === "") {
            return res.status(401).json({ message: "Token inválido" });
        }
        req.user = { id: payload.sub };
        return next();
    }
    catch {
        return res.status(401).json({ message: "Token inválido" });
    }
}
