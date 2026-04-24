import { Request, Response } from "express";
import { OrdersService } from "./orders.service";
import { toHttpError } from "../../shared/errors";

export class OrdersController {
  constructor(private readonly ordersService = new OrdersService()) {}

  create = async (req: Request, res: Response) => {
    try {
      const { description } = req.body ?? {};
      if (typeof description !== "string" || description.trim() === "") {
        return res.status(400).json({ message: "description é obrigatório" });
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const order = await this.ordersService.create({ userId, description });
      return res.status(201).json(order);
    } catch (err) {
      const httpError = toHttpError(err);
      const message = err instanceof Error ? err.message : String(err);
      return res.status(httpError.status).json({ message });
    }
  };

  listAll = async (_req: Request, res: Response) => {
    try {
      const orders = await this.ordersService.listAll();
      return res.status(200).json(orders);
    } catch (err) {
      const httpError = toHttpError(err);
      const message = err instanceof Error ? err.message : String(err);
      return res.status(httpError.status).json({ message });
    }
  };

  listByUser = async (req: Request<{ userId: string }>, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ message: "userId é obrigatório" });

      const orders = await this.ordersService.listByUser(String(userId));
      return res.status(200).json(orders);
    } catch (err) {
      const httpError = toHttpError(err);
      const message = err instanceof Error ? err.message : String(err);
      return res.status(httpError.status).json({ message });
    }
  };
}

