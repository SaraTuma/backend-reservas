import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../types/express";
import { UserRole } from "@prisma/client";

export class ServiceController {
    //Padronizar o retorno da api com a mesma estrutura de retorno {message:string, data: []}
    //Melhorar as validacoes dos dados de entrada
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
        const { name, description, price } = req.body;
        const providerId = req.user?.id;
        if (!providerId) {
            return res.status(401).json({ message: "Usuário não autenticado" , data: []});
        }

        if (!name || !price) {
            return res.status(400).json({ message: "Nome e preço são obrigatórios" , data: []});
        }

        const service = await prisma.service.create({
            data: {
            name,
            description,
            price: Number(price),
            providerId,
            },
        });

        return res.status(201).json({ message: "Serviço criado com sucesso", data:[ service ]});
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      return res.status(500).json({ message: "Erro interno do servidor", data: [] });
    }
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;
      const providerId = req.user?.id;

      const service = await prisma.service.findUnique({ where: { id: Number(id) } });
      if (!service) return res.status(404).json({ error: "Serviço não encontrado" });

      if (req.user?.role === UserRole.PROVIDER && service.providerId !== providerId) {
        return res.status(403).json({ error: "Você não pode atualizar este serviço" });
      }

      const updated = await prisma.service.update({
        where: { id: Number(id) },
        data: { name, description, price: price ? Number(price) : undefined },
      });

      return res.json({ message: "Serviço atualizado com sucesso", data: [updated] });
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const providerId = req.user?.id;

      const service = await prisma.service.findUnique({ where: { id: Number(id) } });
      if (!service) return res.status(404).json({ message: "Serviço não encontrado" });

      if (service.providerId !== providerId) {
        return res.status(403).json({ message: "Você não pode deletar este serviço" });
      }

      await prisma.service.delete({ where: { id: Number(id) } });
      return res.json({ message: "Serviço deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      return res.status(500).json({ message: "Erro interno do servidor" , data: []});
    }
  }

  static async findAll(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;

    let services;

    if (user?.role === UserRole.PROVIDER) {
      services = await prisma.service.findMany({
        where: { providerId: user?.id },
        include: { provider: { select: { id: true, name: true, email: true } } },
      });
    } else {
      services = await prisma.service.findMany({
        include: { provider: { select: { id: true, name: true, email: true } } },
      });
    }

    return res.json({ message: "Requisição realizada com sucesso.", data: services });
  } catch (error) {
    console.error("Erro ao listar serviços:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

  static async findById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "ID do serviço é obrigatório" , data:[]});
      }

      const service = await prisma.service.findUnique({
        where: { id: Number(id) },
        include: {
          provider: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!service) {
        return res.status(404).json({ message: "Serviço não encontrado" , data:[]});
      }

      return res.json({ message: "Serviço encontrado com sucesso.", data: service });
    } catch (error) {
      console.error("Erro ao buscar serviço por ID:", error);
      return res.status(500).json({ message: "Erro interno do servidor", data:[] });
    }
  }


}
