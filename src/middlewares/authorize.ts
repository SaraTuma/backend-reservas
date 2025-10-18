import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticate";
import { checkPermission } from "../utils/permissions";

export function authorize(action: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const { role } = req.user;
    const hasAccess = checkPermission(role, action);

    if (!hasAccess) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    next();
  };
}
