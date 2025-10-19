import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middlewares/authenticate";
import { Prisma, ReservationStatus, TransactionType, UserRole } from "@prisma/client";

export class ReservationController {

  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const clientId = req.user!.id;
      const { serviceId } = req.body;

      if (!serviceId) return res.status(400).json({ error: "serviceId é obrigatório" });

      const service = await prisma.service.findUnique({ where: { id: serviceId } });
      if (!service) return res.status(404).json({ error: "Serviço não encontrado" });

      const client = await prisma.user.findUnique({ where: { id: clientId } });
      if (!client) return res.status(404).json({ error: "Cliente não encontrado" });

      if (client.balance <= service.price) {
        return res.status(400).json({ error: "Saldo insuficiente : "+client.balance +" para o valor de: "+service.price });
      }

      const result = await prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: { id: clientId },
          data: { balance: { decrement: service.price } },
        });

        // Creditar saldo do provider
        await prisma.user.update({
          where: { id: service.providerId },
          data: { balance: { increment: service.price } },
        });

        const reservation = await prisma.reservation.create({
          data: {
            clientId,
            serviceId,
            pricePaid: service.price,
          },
        });

        await prisma.transaction.create({
            data: {
                fromUserId: clientId,
                toUserId: service.providerId,
                amount: service.price,
                type: TransactionType.RESERVATION,
                description: `Reserva do serviço: ${service.name}`,
            },
        });

        return reservation;
      });

      return res.status(201).json({ message: "Reserva criada com sucesso", data: [result ]});

    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }


  static async cancel(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const clientId = req.user!.id;

      const reservation = await prisma.reservation.findUnique({ where: { id: Number(id) } });
      if (!reservation) return res.status(404).json({ message: "Reserva não encontrada" });

      if (reservation.clientId !== clientId) {
        return res.status(403).json({ message: "Você não pode cancelar esta reserva" });
      }

      if (reservation.status === ReservationStatus.CANCELED) {
        return res.status(400).json({ message: "Reserva já cancelada" });
      }

      // Atualizar reserva e reembolsar saldo
      const updatedReservation = await prisma.$transaction(async (prisma) => {
        // Reembolsar cliente
        await prisma.user.update({
          where: { id: clientId },
          data: { balance: { increment: reservation.pricePaid } },
        });

        // Deduzir do provider
        const service = await prisma.service.findUnique({ where: { id: reservation.serviceId } });
        if (service) {
          await prisma.user.update({
            where: { id: service.providerId },
            data: { balance: { decrement: reservation.pricePaid } },
          });
        }

        // Atualizar status
        const updated = await prisma.reservation.update({
          where: { id: Number(id) },
          data: { status: ReservationStatus.CANCELED, canceledAt: new Date() },
        });

          // Registrar transação de reembolso
        await prisma.transaction.create({
            data: {
            fromUserId: service?.providerId,
            toUserId: clientId,
            amount: reservation.pricePaid,
            type: TransactionType.REFUND,
            description: `Reembolso da reserva: ${service?.name}`,
            },
        });

        return updated;
      });

      return res.json({ message: "Reserva cancelada com sucesso", data: [updatedReservation] });

    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async findAll(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;

      let reservations;

      if (role === UserRole.CLIENT) {
        reservations = await prisma.reservation.findMany({
          where: { clientId: userId },
          include: { service: { include: { provider: true } } },
        });
      } else if (role === UserRole.PROVIDER) {
        reservations = await prisma.reservation.findMany({
          where: { service: { providerId: userId } },
          include: { client: true, service: true },
        });
      } else {
        reservations = await prisma.reservation.findMany({
          include: { client: true, service: { include: { provider: true } } },
        });
      }

      return res.json({ reservations });

    } catch (error) {
      console.error("Erro ao listar reservas:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) return res.status(400).json({ message: "Status é obrigatório" });

      const reservation = await prisma.reservation.findUnique({ where: { id: Number(id) } });
      if (!reservation) return res.status(404).json({ message: "Reserva não encontrada" });

      // Provider só pode atualizar reservas de seus serviços
      if (req.user!.role === "PROVIDER" && reservation.serviceId) {
        const service = await prisma.service.findUnique({ where: { id: reservation.serviceId } });
        if (!service || service.providerId !== req.user!.id) {
          return res.status(403).json({ message: "Acesso negado" });
        }
      }

      const updated = await prisma.reservation.update({
        where: { id: Number(id) },
        data: { status },
      });

      return res.json({ message: "Status atualizado", data: [updated] });

    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
