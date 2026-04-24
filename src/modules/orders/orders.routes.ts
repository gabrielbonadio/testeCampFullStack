import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { OrdersController } from "./orders.controller";

export const ordersRoutes = Router();
const controller = new OrdersController();

ordersRoutes.use(authMiddleware);

/**
 * @openapi
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Criação de pedido (userId vem do JWT)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description]
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido criado
 *       401:
 *         description: Não autorizado
 */
ordersRoutes.post("/orders", controller.create);

/**
 * @openapi
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Listagem de todos os pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
ordersRoutes.get("/orders", controller.listAll);

/**
 * @openapi
 * /orders/user/{userId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Listagem de pedidos de um usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário
 */
ordersRoutes.get("/orders/user/:userId", controller.listByUser);

