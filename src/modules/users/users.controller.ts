import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { toHttpError } from "../../shared/errors";

export class UsersController {
  constructor(private readonly usersService = new UsersService()) {}

  create = async (req: Request, res: Response) => {
    try {
      const { cpf, rg, name, age, email, login, password } = req.body ?? {};

      if (
        typeof cpf !== "string" ||
        typeof rg !== "string" ||
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof login !== "string" ||
        typeof password !== "string"
      ) {
        return res.status(400).json({ message: "Campos obrigatórios ausentes" });
      }

      const parsedAge = Number(age);
      if (!Number.isInteger(parsedAge) || parsedAge < 0) {
        return res.status(400).json({ message: "age deve ser um inteiro >= 0" });
      }

      const user = await this.usersService.create({
        cpf,
        rg,
        name,
        age: parsedAge,
        email,
        login,
        password,
      });

      return res.status(201).json(user);
    } catch (err) {
      const httpError = toHttpError(err);
      const message = err instanceof Error ? err.message : String(err);
      return res.status(httpError.status).json({ message });
    }
  };

  update = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "id é obrigatório" });

      const body = (req.body ?? {}) as Record<string, unknown>;
      const nextData: {
        cpf?: string;
        rg?: string;
        name?: string;
        age?: number;
        email?: string;
        login?: string;
        password?: string;
      } = {};

      if (typeof body.cpf === "string") nextData.cpf = body.cpf;
      if (typeof body.rg === "string") nextData.rg = body.rg;
      if (typeof body.name === "string") nextData.name = body.name;
      if (typeof body.email === "string") nextData.email = body.email;
      if (typeof body.login === "string") nextData.login = body.login;
      if (typeof body.password === "string") nextData.password = body.password;
      if (body.age !== undefined) {
        const parsedAge = Number(body.age);
        if (!Number.isInteger(parsedAge) || parsedAge < 0) {
          return res.status(400).json({ message: "age deve ser um inteiro >= 0" });
        }
        nextData.age = parsedAge;
      }

      const user = await this.usersService.update(String(id), nextData);
      return res.status(200).json(user);
    } catch (err) {
      const httpError = toHttpError(err);
      const message = err instanceof Error ? err.message : String(err);
      return res.status(httpError.status).json({ message });
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "id é obrigatório" });

      const result = await this.usersService.softDelete(String(id));
      return res.status(200).json(result);
    } catch (err) {
      const httpError = toHttpError(err);
      const message = err instanceof Error ? err.message : String(err);
      return res.status(httpError.status).json({ message });
    }
  };

  list = async (_req: Request, res: Response) => {
    try {
      const users = await this.usersService.list();
      return res.status(200).json(users);
    } catch (err) {
      const httpError = toHttpError(err);
      const message = err instanceof Error ? err.message : String(err);
      return res.status(httpError.status).json({ message });
    }
  };
}

