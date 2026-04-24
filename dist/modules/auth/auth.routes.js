"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
exports.authRoutes = (0, express_1.Router)();
const controller = new auth_controller_1.AuthController();
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
exports.authRoutes.post("/login", controller.login);
