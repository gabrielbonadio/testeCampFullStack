"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const errors_1 = require("../../shared/errors");
class AuthController {
    authService;
    constructor(authService = new auth_service_1.AuthService()) {
        this.authService = authService;
    }
    login = async (req, res) => {
        try {
            const { login, password } = req.body ?? {};
            if (typeof login !== "string" || typeof password !== "string" || !login || !password) {
                return res.status(400).json({ message: "login e password são obrigatórios" });
            }
            const result = await this.authService.login({ login, password });
            if (!result) {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }
            return res.status(200).json(result);
        }
        catch (err) {
            const httpError = (0, errors_1.toHttpError)(err);
            return res.status(httpError.status).json({ message: httpError.message });
        }
    };
}
exports.AuthController = AuthController;
