"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const orders_controller_1 = require("./orders.controller");
exports.ordersRoutes = (0, express_1.Router)();
const controller = new orders_controller_1.OrdersController();
exports.ordersRoutes.use(auth_middleware_1.authMiddleware);
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
exports.ordersRoutes.post("/orders", controller.create);
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
exports.ordersRoutes.get("/orders", controller.listAll);
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
exports.ordersRoutes.get("/orders/user/:userId", controller.listByUser);
