import request from "supertest";
import { app } from "../app";
import bcrypt from "bcrypt";
import { prismaMock, resetPrismaMock } from "./clientMock";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

describe("Auth - /login", () => {
  beforeEach(() => {
    resetPrismaMock();
  });

  it("deve autenticar com sucesso e retornar token", async () => {
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

    prismaMock.user.findFirst.mockResolvedValue({
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

    const res = await request(app).post("/login").send({
      login: "joao",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user?.login).toBe("joao");
  });

  it("deve falhar com senha errada", async () => {
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

    prismaMock.user.findFirst.mockResolvedValue({
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

    const res = await request(app).post("/login").send({
      login: "joao",
      password: "senha_errada",
    });

    expect(res.status).toBe(401);
  });

  it("deve falhar quando usuário não existe", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const res = await request(app).post("/login").send({
      login: "nao-existe",
      password: "123456",
    });

    expect(res.status).toBe(401);
  });
});

