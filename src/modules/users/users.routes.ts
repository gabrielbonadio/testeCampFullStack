import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { UsersController } from "./users.controller";

export const usersRoutes = Router();
const controller = new UsersController();

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
usersRoutes.post("/users", controller.create);

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
usersRoutes.put("/users/:id", authMiddleware, controller.update);

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
usersRoutes.delete("/users/:id", authMiddleware, controller.delete);

usersRoutes.get("/users", authMiddleware, controller.list);

