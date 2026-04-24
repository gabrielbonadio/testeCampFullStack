import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../shared/errors";

type CreateUserInput = {
  cpf: string;
  rg: string;
  name: string;
  age: number;
  email: string;
  login: string;
  password: string;
};

type UpdateUserInput = Partial<Omit<CreateUserInput, "password">> & {
  password?: string;
};

export class UsersService {
  async create(input: CreateUserInput) {
    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        cpf: input.cpf,
        rg: input.rg,
        name: input.name,
        age: input.age,
        email: input.email,
        login: input.login,
        password: passwordHash,
      },
      select: {
        id: true,
        cpf: true,
        rg: true,
        name: true,
        age: true,
        email: true,
        login: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return user;
  }

  async update(id: string, input: UpdateUserInput) {
    const data: {
      cpf?: string;
      rg?: string;
      name?: string;
      age?: number;
      email?: string;
      login?: string;
      password?: string;
    } = {};

    if (typeof input.cpf === "string") data.cpf = input.cpf;
    if (typeof input.rg === "string") data.rg = input.rg;
    if (typeof input.name === "string") data.name = input.name;
    if (typeof input.age === "number") data.age = input.age;
    if (typeof input.email === "string") data.email = input.email;
    if (typeof input.login === "string") data.login = input.login;
    if (typeof input.password === "string") data.password = await bcrypt.hash(input.password, 10);

    // Não atualiza usuário deletado e evita exceção (P2025) usando updateMany.
    const { count } = await prisma.user.updateMany({
      where: { id, deletedAt: null },
      data,
    });

    if (count === 0) {
      throw new HttpError(404, "Usuário não encontrado");
    }

    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        cpf: true,
        rg: true,
        name: true,
        age: true,
        email: true,
        login: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return user;
  }

  async softDelete(id: string) {
    const now = new Date();
    const { count } = await prisma.user.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: now },
    });

    if (count === 0) {
      throw new HttpError(404, "Usuário não encontrado");
    }

    return { id, deletedAt: now };
  }

  async list() {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        cpf: true,
        rg: true,
        name: true,
        age: true,
        email: true,
        login: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return users;
  }
}

