import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";

type LoginInput = {
  login: string;
  password: string;
};

export class AuthService {
  async login(input: LoginInput) {
    const user = await prisma.user.findFirst({
      where: {
        login: input.login,
        deletedAt: null,
      },
    });

    if (!user) {
      return null;
    }

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) {
      return null;
    }

    const secret = process.env["JWT_SECRET"];
    if (!secret) {
      throw new Error("JWT_SECRET não configurado");
    }

    const token = jwt.sign({}, secret, {
      subject: user.id,
      expiresIn: "1d",
    });

    return {
      token,
      user: {
        id: user.id,
        cpf: user.cpf,
        rg: user.rg,
        name: user.name,
        age: user.age,
        email: user.email,
        login: user.login,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

