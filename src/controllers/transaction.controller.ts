import {  Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middlewares/authenticate";
import { UserRole } from "@prisma/client";

export class TransactionController {
  static async findAll(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id; 

      let transactions;

      if (req.user?.role === UserRole.ADMIN) {
        transactions = await prisma.transaction.findMany({
          orderBy: { createdAt: "desc" },
        });
      } else {
        transactions = await prisma.transaction.findMany({
          where: {
            OR: [{ fromUserId: userId }, { toUserId: userId }],
          },
          orderBy: { createdAt: "desc" },
        });
      }

      return res.json({ data: transactions , message: "Enviado com sucesso"});
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return res.status(500).json({ message: "Erro ao buscar transações" });
    }
  }
}
