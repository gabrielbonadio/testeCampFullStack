"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const clientMock_1 = require("./clientMock");
const globals_1 = require("@jest/globals");
function authHeader(userId) {
    const token = jsonwebtoken_1.default.sign({}, process.env["JWT_SECRET"], { subject: userId, expiresIn: "1d" });
    return { Authorization: `Bearer ${token}` };
}
async function createOrderAs(userId, description) {
    return (0, supertest_1.default)(app_1.app)
        .post("/orders")
        .set(authHeader(userId))
        .send({ description });
}
(0, globals_1.describe)("Orders - /orders", () => {
    (0, globals_1.beforeEach)(() => {
        (0, clientMock_1.resetPrismaMock)();
    });
    (0, globals_1.it)("deve criar pedido extraindo userId do JWT", async () => {
        const userId = "user-1";
        clientMock_1.prismaMock.user.findFirst.mockResolvedValue({
            id: userId,
            cpf: "12345678901",
            rg: "1234567",
            name: "João",
            age: 30,
            email: "joao@test.com",
            login: "joao",
            password: "HASH",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        clientMock_1.prismaMock.order.create.mockResolvedValue({
            id: "order-1",
            description: "Pedido 1",
            userId,
            createdAt: new Date(),
        });
        const res = await createOrderAs(userId, "Pedido 1");
        (0, globals_1.expect)(res.status).toBe(201);
        (0, globals_1.expect)(res.body.id).toBeTruthy();
        (0, globals_1.expect)(res.body.description).toBe("Pedido 1");
        (0, globals_1.expect)(res.body.userId).toBe(userId);
    });
    (0, globals_1.it)("deve listar todos os pedidos", async () => {
        const userId = "user-1";
        clientMock_1.prismaMock.order.findMany.mockResolvedValue([
            { id: "o1", description: "Pedido A", userId, createdAt: new Date() },
            { id: "o2", description: "Pedido B", userId, createdAt: new Date() },
        ]);
        const listRes = await (0, supertest_1.default)(app_1.app).get("/orders").set(authHeader(userId));
        (0, globals_1.expect)(listRes.status).toBe(200);
        (0, globals_1.expect)(Array.isArray(listRes.body)).toBe(true);
        (0, globals_1.expect)(listRes.body).toHaveLength(2);
    });
    (0, globals_1.it)("deve listar pedidos por usuário específico", async () => {
        const userId = "user-1";
        clientMock_1.prismaMock.user.findFirst.mockResolvedValue({
            id: userId,
            cpf: "12345678901",
            rg: "1234567",
            name: "João",
            age: 30,
            email: "joao@test.com",
            login: "joao",
            password: "HASH",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        clientMock_1.prismaMock.order.findMany.mockResolvedValue([
            { id: "o1", description: "Pedido do João", userId, createdAt: new Date() },
        ]);
        const listByUserRes = await (0, supertest_1.default)(app_1.app)
            .get(`/orders/user/${userId}`)
            .set(authHeader(userId));
        (0, globals_1.expect)(listByUserRes.status).toBe(200);
        (0, globals_1.expect)(Array.isArray(listByUserRes.body)).toBe(true);
        (0, globals_1.expect)(listByUserRes.body).toHaveLength(1);
        (0, globals_1.expect)(listByUserRes.body[0].userId).toBe(userId);
        (0, globals_1.expect)(listByUserRes.body[0].description).toBe("Pedido do João");
    });
});
