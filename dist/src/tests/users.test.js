"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../shared/errors");
const clientMock_1 = require("./clientMock");
const globals_1 = require("@jest/globals");
function authHeader(userId) {
    // Token "mockado": o middleware valida assinatura e extrai sub
    const token = jsonwebtoken_1.default.sign({}, process.env["JWT_SECRET"], { subject: userId, expiresIn: "1d" });
    return { Authorization: `Bearer ${token}` };
}
async function createUser() {
    const payload = {
        cpf: "12345678901",
        rg: "1234567",
        name: "João",
        age: 30,
        email: "joao@test.com",
        login: "joao",
        password: "123456",
    };
    const res = await (0, supertest_1.default)(app_1.app).post("/users").send(payload);
    return { res, payload };
}
(0, globals_1.describe)("Users - /users", () => {
    (0, globals_1.beforeEach)(() => {
        (0, clientMock_1.resetPrismaMock)();
        globals_1.jest.spyOn(bcrypt_1.default, "hash").mockImplementation(((data) => Promise.resolve(`HASH(${data.toString()})`)));
    });
    (0, globals_1.it)("deve criar usuário com sucesso (hash da senha) e não retornar password", async () => {
        clientMock_1.prismaMock.user.create.mockResolvedValue({
            id: "user-1",
            cpf: "12345678901",
            rg: "1234567",
            name: "João",
            age: 30,
            email: "joao@test.com",
            login: "joao",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        const { res } = await createUser();
        (0, globals_1.expect)(res.status).toBe(201);
        (0, globals_1.expect)(res.body.id).toBeTruthy();
        (0, globals_1.expect)(res.body.password).toBeUndefined();
    });
    (0, globals_1.it)("deve retornar erro ao criar CPF duplicado", async () => {
        clientMock_1.prismaMock.user.create.mockResolvedValueOnce({
            id: "user-1",
            cpf: "12345678901",
            rg: "1234567",
            name: "João",
            age: 30,
            email: "joao@test.com",
            login: "joao",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        clientMock_1.prismaMock.user.create.mockRejectedValueOnce(new errors_1.HttpError(400, "Violação de unicidade (cpf/email/login já existe)"));
        await createUser();
        const res2 = await (0, supertest_1.default)(app_1.app).post("/users").send({
            cpf: "12345678901",
            rg: "7654321",
            name: "Maria",
            age: 25,
            email: "maria@test.com",
            login: "maria",
            password: "123456",
        });
        (0, globals_1.expect)(res2.status).toBe(400);
    });
    (0, globals_1.it)("deve atualizar dados do usuário (JWT)", async () => {
        clientMock_1.prismaMock.user.create.mockResolvedValue({
            id: "user-1",
            cpf: "12345678901",
            rg: "1234567",
            name: "João",
            age: 30,
            email: "joao@test.com",
            login: "joao",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        clientMock_1.prismaMock.user.updateMany.mockResolvedValue({ count: 1 });
        clientMock_1.prismaMock.user.findFirst.mockResolvedValue({
            id: "user-1",
            cpf: "12345678901",
            rg: "1234567",
            name: "João Silva",
            age: 31,
            email: "joao@test.com",
            login: "joao",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        const { res } = await createUser();
        const updateRes = await (0, supertest_1.default)(app_1.app)
            .put(`/users/${res.body.id}`)
            .set(authHeader(res.body.id))
            .send({ name: "João Silva", age: 31 });
        (0, globals_1.expect)(updateRes.status).toBe(200);
        (0, globals_1.expect)(updateRes.body.name).toBe("João Silva");
        (0, globals_1.expect)(updateRes.body.age).toBe(31);
    });
    (0, globals_1.it)("deve listar usuários (sem senha, sem deletados) com JWT", async () => {
        clientMock_1.prismaMock.user.create.mockResolvedValue({
            id: "user-1",
            cpf: "12345678901",
            rg: "1234567",
            name: "João",
            age: 30,
            email: "joao@test.com",
            login: "joao",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        clientMock_1.prismaMock.user.findMany.mockResolvedValue([
            {
                id: "user-1",
                cpf: "12345678901",
                rg: "1234567",
                name: "João",
                age: 30,
                email: "joao@test.com",
                login: "joao",
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            },
        ]);
        const { res } = await createUser();
        const listRes = await (0, supertest_1.default)(app_1.app).get("/users").set(authHeader(res.body.id));
        (0, globals_1.expect)(listRes.status).toBe(200);
        (0, globals_1.expect)(Array.isArray(listRes.body)).toBe(true);
        (0, globals_1.expect)(listRes.body).toHaveLength(1);
        (0, globals_1.expect)(listRes.body[0].id).toBe(res.body.id);
        (0, globals_1.expect)(listRes.body[0].password).toBeUndefined();
    });
    (0, globals_1.it)("deve realizar exclusão lógica e usuário não aparece na listagem / não consegue logar", async () => {
        clientMock_1.prismaMock.user.create.mockResolvedValue({
            id: "user-1",
            cpf: "12345678901",
            rg: "1234567",
            name: "João",
            age: 30,
            email: "joao@test.com",
            login: "joao",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        clientMock_1.prismaMock.user.updateMany.mockResolvedValue({ count: 1 });
        clientMock_1.prismaMock.user.findMany.mockResolvedValue([]);
        clientMock_1.prismaMock.user.findFirst.mockResolvedValue(null); // login pós delete => não encontra (deletedAt != null)
        globals_1.jest.spyOn(bcrypt_1.default, "compare").mockResolvedValue(false);
        const { res } = await createUser();
        const delRes = await (0, supertest_1.default)(app_1.app)
            .delete(`/users/${res.body.id}`)
            .set(authHeader(res.body.id));
        (0, globals_1.expect)(delRes.status).toBe(200);
        (0, globals_1.expect)(delRes.body.deletedAt).toBeTruthy();
        const listRes = await (0, supertest_1.default)(app_1.app).get("/users").set(authHeader(res.body.id));
        (0, globals_1.expect)(listRes.status).toBe(200);
        (0, globals_1.expect)(listRes.body).toHaveLength(0);
        const loginRes = await (0, supertest_1.default)(app_1.app).post("/login").send({ login: "joao", password: "123456" });
        (0, globals_1.expect)(loginRes.status).toBe(401);
    });
});
