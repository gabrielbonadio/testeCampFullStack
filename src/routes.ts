import { Router } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import { ordersRoutes } from "./modules/orders/orders.routes";
import { usersRoutes } from "./modules/users/users.routes";

export const routes = Router();

routes.use(authRoutes);
routes.use(usersRoutes);
routes.use(ordersRoutes);

