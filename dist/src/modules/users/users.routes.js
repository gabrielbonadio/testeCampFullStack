"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const users_controller_1 = require("./users.controller");
exports.usersRoutes = (0, express_1.Router)();
const controller = new users_controller_1.UsersController();
/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Cadastro de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cpf, rg, name, age, email, login, password]
 *             properties:
 *               cpf: { type: string }
 *               rg: { type: string }
 *               name: { type: string }
 *               age: { type: integer }
 *               email: { type: string }
 *               login: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Usuário criado
 */
exports.usersRoutes.post("/users", controller.create);
/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listagem de usuários (sem senha, sem deletados)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado
 */
/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Atualização de usuário (protegido)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf: { type: string }
 *               rg: { type: string }
 *               name: { type: string }
 *               age: { type: integer }
 *               email: { type: string }
 *               login: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       401:
 *         description: Não autorizado
 */
exports.usersRoutes.put("/users/:id", auth_middleware_1.authMiddleware, controller.update);
/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Exclusão lógica (soft delete) do usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuário marcado como deletado
 *       401:
 *         description: Não autorizado
 */
exports.usersRoutes.delete("/users/:id", auth_middleware_1.authMiddleware, controller.delete);
exports.usersRoutes.get("/users", auth_middleware_1.authMiddleware, controller.list);
