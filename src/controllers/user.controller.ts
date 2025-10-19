import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../types/express";

export class UserController {

 

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) return res.status(404).json({ message: "Usuario não encontrado" });

      await prisma.user.delete({ where: { id: Number(id) } });
      return res.json({ message: "Usuario deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar Usuario:", error);
      return res.status(500).json({ message: "Erro interno do servidor" , data: []});
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        nif: true,
        role: true,
        balance: true,
        createdAt: true,
      },
    })

      return res.json({message: "Requisição realizada com sucesso.", data:users});
    } catch (error) {
      console.error("Erro ao listar usuarios:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

   static async getClientsByProvider(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
        const reservations = await prisma.reservation.findMany({
        where: {
            service: {  providerId: Number(id)},
        },
        select: {
            client: {
            select: {
                id: true,
                name: true,
                email: true,
                nif: true,
                balance: true,
                createdAt: true,
            },
            },
        },
        });

        const uniqueClients = Array.from(
        new Map(reservations.map(r => [r.client.id, r.client])).values()
        );

        return res.status(200).json({ message: "Clientes encontrados com sucesso" , data : uniqueClients});
    } catch (error) {
      console.error("Erro ao buscar Clientes:", error);
      return res.status(500).json({ message: "Erro interno do servidor" , data: []});
    }
}
}
