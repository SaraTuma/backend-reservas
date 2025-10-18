import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: "CLIENT" | "PROVIDER" | "ADMIN";
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "default_secret";

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
