import express from "express";
import swaggerUi from "swagger-ui-express";
import { routes } from "./routes";
import { swaggerSpec } from "./swagger";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

