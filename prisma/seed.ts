import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  await prisma.authSession.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hashPassword("AdminPass123!");
  const userPassword = await hashPassword("UserPass123!");

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@prodboard.com",
      password_hash: adminPassword,
      role: "admin"
    }
  });

  const user = await prisma.user.create({
    data: {
      name: "Regular User",
      email: "user@prodboard.com",
      password_hash: userPassword,
      role: "user"
    }
  });

  await prisma.product.create({
    data: {
      name: "Aurora Wireless Headphones",
      description: "Noise-cancelling wireless headphones with 30-hour battery life.",
      price: 189.99,
      currency: "USD",
      stock: 42,
      images: JSON.stringify([
        "https://images.example.com/products/headphones-1.jpg",
        "https://images.example.com/products/headphones-2.jpg"
      ]),
      category: "Electronics",
      created_by: admin.id
    }
  });

  await prisma.product.create({
    data: {
      name: "Nimbus Smartwatch",
      description: "Smartwatch with health tracking, GPS, and customizable faces.",
      price: 249.0,
      currency: "USD",
      stock: 28,
      images: JSON.stringify([
        "https://images.example.com/products/smartwatch-1.jpg"
      ]),
      category: "Wearables",
      created_by: admin.id
    }
  });

  await prisma.product.create({
    data: {
      name: "Summit Hiking Backpack",
      description: "Lightweight 35L backpack with ergonomic support and waterproof lining.",
      price: 129.5,
      currency: "USD",
      stock: 65,
      images: JSON.stringify([
        "https://images.example.com/products/backpack-1.jpg",
        "https://images.example.com/products/backpack-2.jpg"
      ]),
      category: "Outdoor",
      created_by: admin.id
    }
  });

  await prisma.authSession.create({
    data: {
      token: "seed-admin-token",
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      user_id: admin.id
    }
  });

  await prisma.authSession.create({
    data: {
      token: "seed-user-token",
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      user_id: user.id
    }
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
