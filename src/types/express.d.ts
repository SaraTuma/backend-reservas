import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
    email?: string;
    nif?: string;
  };
}
