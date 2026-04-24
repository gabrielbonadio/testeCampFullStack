"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const bcrypt_1 = __importDefault(require("bcrypt"));
const clientMock_1 = require("./clientMock");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)("Auth - /login", () => {
    (0, globals_1.beforeEach)(() => {
        (0, clientMock_1.resetPrismaMock)();
    });
    (0, globals_1.it)("deve autenticar com sucesso e retornar token", async () => {
        globals_1.jest.spyOn(bcrypt_1.default, "compare").mockResolvedValue(true);
        clientMock_1.prismaMock.user.findFirst.mockResolvedValue({
            id: "user-1",
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
        const res = await (0, supertest_1.default)(app_1.app).post("/login").send({
            login: "joao",
            password: "123456",
        });
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body.token).toBeTruthy();
        (0, globals_1.expect)(res.body.user?.login).toBe("joao");
    });
    (0, globals_1.it)("deve falhar com senha errada", async () => {
        globals_1.jest.spyOn(bcrypt_1.default, "compare").mockResolvedValue(false);
        clientMock_1.prismaMock.user.findFirst.mockResolvedValue({
            id: "user-1",
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
        const res = await (0, supertest_1.default)(app_1.app).post("/login").send({
            login: "joao",
            password: "senha_errada",
        });
        (0, globals_1.expect)(res.status).toBe(401);
    });
    (0, globals_1.it)("deve falhar quando usuário não existe", async () => {
        clientMock_1.prismaMock.user.findFirst.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app_1.app).post("/login").send({
            login: "nao-existe",
            password: "123456",
        });
        (0, globals_1.expect)(res.status).toBe(401);
    });
});
