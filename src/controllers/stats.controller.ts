import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class StatsController {
  static async getCounts(req: Request, res: Response) {
    try {
      const [usersCount, servicesCount, reservationsCount] = await Promise.all([
        prisma.user.count(),
        prisma.service.count(),
        prisma.reservation.count(),
      ]);

      return res.json({
        users: usersCount,
        services: servicesCount,
        reservations: reservationsCount,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      return res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  }
}
