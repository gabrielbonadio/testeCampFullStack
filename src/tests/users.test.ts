import request from "supertest";
import { app } from "../app";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpError } from "../shared/errors";
import { prismaMock, resetPrismaMock } from "./clientMock";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

function authHeader(userId: string) {
  // Token "mockado": o middleware valida assinatura e extrai sub
  const token = jwt.sign({}, process.env["JWT_SECRET"]!, { subject: userId, expiresIn: "1d" });
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

  const res = await request(app).post("/users").send(payload);
  return { res, payload };
}

describe("Users - /users", () => {
  beforeEach(() => {
    resetPrismaMock();
    jest.spyOn(bcrypt, "hash").mockImplementation(((data: string | Buffer) =>
      Promise.resolve(`HASH(${data.toString()})`)) as never);
  });

  it("deve criar usuário com sucesso (hash da senha) e não retornar password", async () => {
    prismaMock.user.create.mockResolvedValue({
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
    } as unknown as never);

    const { res } = await createUser();
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.password).toBeUndefined();
  });

  it("deve retornar erro ao criar CPF duplicado", async () => {
    prismaMock.user.create.mockResolvedValueOnce({
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
    } as unknown as never);

    prismaMock.user.create.mockRejectedValueOnce(
      new HttpError(400, "Violação de unicidade (cpf/email/login já existe)"),
    );

    await createUser();

    const res2 = await request(app).post("/users").send({
      cpf: "12345678901",
      rg: "7654321",
      name: "Maria",
      age: 25,
      email: "maria@test.com",
      login: "maria",
      password: "123456",
    });

    expect(res2.status).toBe(400);
  });

  it("deve atualizar dados do usuário (JWT)", async () => {
    prismaMock.user.create.mockResolvedValue({
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
    } as unknown as never);

    prismaMock.user.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.user.findFirst.mockResolvedValue({
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
    } as unknown as never);

    const { res } = await createUser();

    const updateRes = await request(app)
      .put(`/users/${res.body.id}`)
      .set(authHeader(res.body.id))
      .send({ name: "João Silva", age: 31 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe("João Silva");
    expect(updateRes.body.age).toBe(31);
  });

  it("deve listar usuários (sem senha, sem deletados) com JWT", async () => {
    prismaMock.user.create.mockResolvedValue({
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
    } as unknown as never);

    prismaMock.user.findMany.mockResolvedValue([
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
    ] as unknown as never);

    const { res } = await createUser();

    const listRes = await request(app).get("/users").set(authHeader(res.body.id));
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(res.body.id);
    expect(listRes.body[0].password).toBeUndefined();
  });

  it("deve realizar exclusão lógica e usuário não aparece na listagem / não consegue logar", async () => {
    prismaMock.user.create.mockResolvedValue({
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
    } as unknown as never);

    prismaMock.user.updateMany.mockResolvedValue({ count: 1 });

    prismaMock.user.findMany.mockResolvedValue([]);
    prismaMock.user.findFirst.mockResolvedValue(null); // login pós delete => não encontra (deletedAt != null)
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

    const { res } = await createUser();

    const delRes = await request(app)
      .delete(`/users/${res.body.id}`)
      .set(authHeader(res.body.id));
    expect(delRes.status).toBe(200);
    expect(delRes.body.deletedAt).toBeTruthy();

    const listRes = await request(app).get("/users").set(authHeader(res.body.id));
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(0);

    const loginRes = await request(app).post("/login").send({ login: "joao", password: "123456" });
    expect(loginRes.status).toBe(401);
  });
});

