import { Router } from "express";
import { AuthController } from "./auth.controller";

export const authRoutes = Router();
const controller = new AuthController();

/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login e geração de JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, password]
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticado
 *       401:
 *         description: Credenciais inválidas
 */
authRoutes.post("/login", controller.login);

