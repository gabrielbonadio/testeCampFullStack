import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { toHttpError } from "../../shared/errors";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  login = async (req: Request, res: Response) => {
    try {
      const { login, password } = req.body ?? {};

      if (typeof login !== "string" || typeof password !== "string" || !login || !password) {
        return res.status(400).json({ message: "login e password são obrigatórios" });
      }

      const result = await this.authService.login({ login, password });
      if (!result) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      return res.status(200).json(result);
    } catch (err) {
      const httpError = toHttpError(err);
      const message = err instanceof Error ? err.message : String(err);
      return res.status(httpError.status).json({ message });
    }
  };
}

