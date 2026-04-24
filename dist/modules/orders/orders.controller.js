"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const orders_service_1 = require("./orders.service");
const errors_1 = require("../../shared/errors");
class OrdersController {
    ordersService;
    constructor(ordersService = new orders_service_1.OrdersService()) {
        this.ordersService = ordersService;
    }
    create = async (req, res) => {
        try {
            const { description } = req.body ?? {};
            if (typeof description !== "string" || description.trim() === "") {
                return res.status(400).json({ message: "description é obrigatório" });
            }
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }
            const order = await this.ordersService.create({ userId, description });
            return res.status(201).json(order);
        }
        catch (err) {
            const httpError = (0, errors_1.toHttpError)(err);
            return res.status(httpError.status).json({ message: httpError.message });
        }
    };
    listAll = async (_req, res) => {
        try {
            const orders = await this.ordersService.listAll();
            return res.status(200).json(orders);
        }
        catch (err) {
            const httpError = (0, errors_1.toHttpError)(err);
            return res.status(httpError.status).json({ message: httpError.message });
        }
    };
    listByUser = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId)
                return res.status(400).json({ message: "userId é obrigatório" });
            const orders = await this.ordersService.listByUser(userId);
            return res.status(200).json(orders);
        }
        catch (err) {
            const httpError = (0, errors_1.toHttpError)(err);
            return res.status(httpError.status).json({ message: httpError.message });
        }
    };
}
exports.OrdersController = OrdersController;
