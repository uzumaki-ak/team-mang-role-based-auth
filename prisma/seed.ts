import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/app/lib/auth";
import { Role } from "@/app/types";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create ADMIN user first (no team)
  const adminUser = await prisma.user.create({
    data: {
      name: "Shreya",
      email: "akuzumaki143@gmail.com",
      password: await hashPassword("12345678"),
      role: "ADMIN",
      teamId: null,
    },
  });
  console.log("✅ Admin user created:", adminUser.email);

  // Create teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "akatsuki",
        description: "A secret organization",
        code: "akatsuki123",
      },
    }),
    prisma.team.create({
      data: {
        name: "shinsengumi",
        description: "A special police force",
        code: "shinsengumi123",
      },
    }),
    prisma.team.create({
      data: {
        name: "stark",
        description: "Winter is coming",
        code: "winter123",
      },
    }),
  ]);
  console.log("✅ Teams created:", teams.length);

  // Create users
  const sampleUsers = [
    {
      name: "Itachi Uchiha",
      email: "itachi@gmail.com",
      team: teams[0],
      role: "MANAGER" as Role,
    },
    {
      name: "Kenshin Himura",
      email: "kenshin@gmail.com",
      team: teams[1],
      role: "USER" as Role,
    },
    {
      name: "Jon Snow",
      email: "jon@gmail.com",
      team: teams[2],
      role: "MANAGER" as Role,
    },
    {
      name: "Arya Stark",
      email: "arya@gmail.com",
      team: teams[2],
      role: "USER" as Role,
    },
  ];

  for (const userData of sampleUsers) {
    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: await hashPassword("12345678"),
        role: userData.role,
        teamId: userData.team.id,
      },
    });
  }
  console.log("✅ Sample users created:", sampleUsers.length);

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding data failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });