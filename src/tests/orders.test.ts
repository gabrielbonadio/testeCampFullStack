import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
import { prismaMock, resetPrismaMock } from "./clientMock";
import { beforeEach, describe, expect, it } from "@jest/globals";

function authHeader(userId: string) {
  const token = jwt.sign({}, process.env["JWT_SECRET"]!, { subject: userId, expiresIn: "1d" });
  return { Authorization: `Bearer ${token}` };
}

async function createOrderAs(userId: string, description: string) {
  return request(app)
    .post("/orders")
    .set(authHeader(userId))
    .send({ description });
}

describe("Orders - /orders", () => {
  beforeEach(() => {
    resetPrismaMock();
  });

  it("deve criar pedido extraindo userId do JWT", async () => {
    const userId = "user-1";

    prismaMock.user.findFirst.mockResolvedValue({
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
    } as unknown as never);

    prismaMock.order.create.mockResolvedValue({
      id: "order-1",
      description: "Pedido 1",
      userId,
      createdAt: new Date(),
    } as unknown as never);

    const res = await createOrderAs(userId, "Pedido 1");

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.description).toBe("Pedido 1");
    expect(res.body.userId).toBe(userId);
  });

  it("deve listar todos os pedidos", async () => {
    const userId = "user-1";
    prismaMock.order.findMany.mockResolvedValue([
      { id: "o1", description: "Pedido A", userId, createdAt: new Date() },
      { id: "o2", description: "Pedido B", userId, createdAt: new Date() },
    ] as unknown as never);

    const listRes = await request(app).get("/orders").set(authHeader(userId));

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toHaveLength(2);
  });

  it("deve listar pedidos por usuário específico", async () => {
    const userId = "user-1";

    prismaMock.user.findFirst.mockResolvedValue({
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
    } as unknown as never);

    prismaMock.order.findMany.mockResolvedValue([
      { id: "o1", description: "Pedido do João", userId, createdAt: new Date() },
    ] as unknown as never);

    const listByUserRes = await request(app)
      .get(`/orders/user/${userId}`)
      .set(authHeader(userId));

    expect(listByUserRes.status).toBe(200);
    expect(Array.isArray(listByUserRes.body)).toBe(true);
    expect(listByUserRes.body).toHaveLength(1);
    expect(listByUserRes.body[0].userId).toBe(userId);
    expect(listByUserRes.body[0].description).toBe("Pedido do João");
  });
});

