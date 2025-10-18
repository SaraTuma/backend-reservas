import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de usuários...");

  const users = [
    { name: "Alice Silva", nif: "100001001", email: "alice@test.com", role: UserRole.CLIENT },
    { name: "Bruno Costa", nif: "100001002", email: "bruno@test.com", role: UserRole.CLIENT },
    { name: "Carla Santos", nif: "100001003", email: "carla@test.com", role: UserRole.CLIENT },
    { name: "Daniel Oliveira", nif: "100001004", email: "daniel@test.com", role: UserRole.PROVIDER },
    { name: "Eduarda Mendes", nif: "100001005", email: "eduarda@test.com", role: UserRole.PROVIDER },
    { name: "Fábio Rocha", nif: "100001006", email: "fabio@test.com", role: UserRole.PROVIDER },
    { name: "Gabriela Lopes", nif: "100001007", email: "gabriela@test.com", role: UserRole.CLIENT },
    { name: "Helena Dias", nif: "100001008", email: "helena@test.com", role: UserRole.CLIENT },
    { name: "Igor Almeida", nif: "100001009", email: "igor@test.com", role: UserRole.ADMIN },
    { name: "Joana Ferreira", nif: "100001010", email: "joana@test.com", role: UserRole.ADMIN },
  ];

  const hashedPassword = await bcrypt.hash("123456", 10);

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        nif: user.nif,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        balance: 10000.0,
      },
    });
  }

  console.log("10 usuários criados com sucesso!");

  const providers = await prisma.user.findMany({
    where: { role: "PROVIDER" },
    take: 2,
  });

  if (providers.length === 0) {
    console.log("Nenhum provider encontrado. Crie usuários do tipo PROVIDER antes do seed.");
    return;
  }

  const servicesData = [
    {
      name: "Corte de Cabelo",
      description: "Serviço de corte de cabelo profissional",
      price: 15.5,
      providerId: providers[0].id,
    },
    {
      name: "Manicure",
      description: "Serviço de manicure completo",
      price: 10,
      providerId: providers[0].id,
    },
    {
      name: "Massagem Relaxante",
      description: "Sessão de 1 hora de massagem relaxante",
      price: 25,
      providerId: providers[1].id,
    },
    {
      name: "Aula de Yoga",
      description: "Aula particular de yoga",
      price: 20,
      providerId: providers[1].id,
    },
    {
      name: "Treino Personalizado",
      description: "Sessão de treino personalizado na academia",
      price: 30,
      providerId: providers[1].id,
    },
  ];

  for (const service of servicesData) {
    await prisma.service.create({ data: service });
  }

  console.log("Seed de serviços concluído!");

  console.log("Seeding transactions...");

  await prisma.transaction.createMany({
    data: [
      {
        fromUserId: 1, // client
        toUserId: 2,   // provider
        amount: 100.0,
        type: "RESERVATION",
        description: "Reserva do serviço: Corte de cabelo",
      },
      {
        fromUserId: 3, // client
        toUserId: 2,   // provider
        amount: 50.0,
        type: "RESERVATION",
        description: "Reserva do serviço: Manicure",
      },
      {
        fromUserId: 2, // provider
        toUserId: 1,   // client
        amount: 100.0,
        type: "REFUND",
        description: "Reembolso da reserva: Corte de cabelo",
      },
    ],
  });

  console.log("Transactions seeded!");

}

main()
  .catch((e) => {
    console.error("Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
