import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user1234");

  const admin = await prisma.user.upsert({
    where: { email: "admin@productly.dev" },
    update: {},
    create: {
      name: "Productly Admin",
      email: "admin@productly.dev",
      passwordHash: adminPassword,
      role: "admin"
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "user@productly.dev" },
    update: {},
    create: {
      name: "Productly User",
      email: "user@productly.dev",
      passwordHash: userPassword,
      role: "user"
    }
  });

  const products = [
    {
      name: "Nimbus Desk Lamp",
      description: "Minimalist LED desk lamp with adjustable brightness.",
      price: 79.99,
      sku: "NDL-100",
      stock: 32,
      active: true,
      ownerId: admin.id,
      images: JSON.stringify(["/images/hero.jpg"])
    },
    {
      name: "Aurora Smart Speaker",
      description: "Wi-Fi enabled smart speaker with voice control.",
      price: 129.5,
      sku: "ASS-210",
      stock: 18,
      active: true,
      ownerId: user.id,
      images: JSON.stringify(["/images/feature.jpg", "/images/cta.jpg"])
    },
    {
      name: "Atlas Backpack",
      description: "Water-resistant backpack for everyday travel.",
      price: 64.0,
      sku: "ABP-455",
      stock: 54,
      active: true,
      ownerId: user.id,
      images: JSON.stringify([])
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
