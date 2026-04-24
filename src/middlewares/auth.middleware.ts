import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token ausente" });
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET não configurado" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== "object" || decoded === null) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const payload = decoded as jwt.JwtPayload;
    if (typeof payload.sub !== "string" || payload.sub.trim() === "") {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.user = { id: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}

