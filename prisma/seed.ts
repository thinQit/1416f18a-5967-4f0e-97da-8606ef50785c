import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const userPassword = await bcrypt.hash('user1234', 10);

  await db.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@shopflow.dev',
      passwordHash: adminPassword,
      role: 'admin'
    }
  });

  await db.user.create({
    data: {
      name: 'Jamie Customer',
      email: 'user@shopflow.dev',
      passwordHash: userPassword,
      role: 'user'
    }
  });

  const products = [
    {
      name: 'Flowstate Sneakers',
      description: 'Lightweight sneakers engineered for all-day comfort and style.',
      price: 89.99,
      currency: 'USD',
      stock: 42,
      images: JSON.stringify(['/images/feature.jpg'])
    },
    {
      name: 'Momentum Backpack',
      description: 'Water-resistant backpack with modular storage for remote teams.',
      price: 129.0,
      currency: 'USD',
      stock: 18,
      images: JSON.stringify(['/images/hero.jpg'])
    },
    {
      name: 'Aurora Desk Lamp',
      description: 'Minimal LED lamp with adjustable brightness and color temperature.',
      price: 59.0,
      currency: 'USD',
      stock: 27,
      images: JSON.stringify(['/images/cta.jpg'])
    }
  ];

  for (const product of products) {
    await db.product.create({ data: product });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
