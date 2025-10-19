import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

export class AuthController {

  static async register(req: Request, res: Response) {
    try {
      const { name, nif, email, password, role } = req.body;

      if (!name || !nif || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ nif }, { email }] },
      });

      if (existingUser) {
        return res.status(400).json({ message: "NIF ou email já estão registrados."+existingUser.name });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          nif,
          email,
          password: hashedPassword,
          role: role && [UserRole.CLIENT, UserRole.PROVIDER].includes(role.toUpperCase())
            ? role.toUpperCase()
            : UserRole.CLIENT,
        },
        select: {
          id: true,
          name: true,
          role: true,
          email: true,
          balance: true,
        },
      });

      return res.status(201).json({
        message: "Usuário criado com sucesso.",
        status:201,
        data: {user: newUser},
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async login(req: Request, res: Response) {
    try {
        const { emailOrNif, password } = req.body;

        if (!emailOrNif || !password) {
            return res.status(400).json({ message: "E-mail/NIF e senha são obrigatórios." });
        }

        const isEmail = emailOrNif.includes("@");

        const user = await prisma.user.findFirst({
        where: isEmail ? { email: emailOrNif } : { nif: emailOrNif },
        });

        if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
        return res.status(401).json({ message: "Senha incorreta." });
        }

        const token = generateToken({
            id: user.id,
            role: user.role,
            identifier: isEmail ? user.email : user.nif,
        });

        return res.status(200).json({
        message: "Login bem-sucedido.",
        status: 200,
        token,
        data: {
            user: {
            id: user.id,
            name: user.name,
            email: user.email,
            nif: user.nif,
            role: user.role,
            balance: user.balance,
            },
        },
        });
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
    }

}
