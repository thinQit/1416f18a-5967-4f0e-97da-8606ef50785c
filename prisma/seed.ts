import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const db = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword('AdminPass123');
  const userPassword = await hashPassword('UserPass123');

  const admin = await db.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'admin'
    }
  });

  await db.user.create({
    data: {
      name: 'Jordan Lee',
      email: 'jordan@example.com',
      passwordHash: userPassword,
      role: 'user'
    }
  });

  const products = [
    {
      title: 'Wireless Headphones',
      description: 'Noise-cancelling over-ear headphones with 30-hour battery life.',
      price: 199.99,
      inventory: 12,
      imageUrl: 'https://images.unsplash.com/photo-1518442708563-e1ae3cf6b74a'
    },
    {
      title: 'Smart Fitness Watch',
      description: 'Track workouts, sleep, and heart rate with a sleek wearable.',
      price: 149.5,
      inventory: 8,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
    },
    {
      title: 'Portable Bluetooth Speaker',
      description: 'Water-resistant speaker with deep bass and 12-hour playtime.',
      price: 79.0,
      inventory: 20,
      imageUrl: 'https://images.unsplash.com/photo-1512446816042-444d641267d4'
    },
    {
      title: 'Ergonomic Office Chair',
      description: 'Adjustable lumbar support and breathable mesh for all-day comfort.',
      price: 249.99,
      inventory: 5,
      imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4'
    },
    {
      title: 'Minimalist Desk Lamp',
      description: 'LED lamp with adjustable brightness and a compact footprint.',
      price: 45.25,
      inventory: 18,
      imageUrl: 'https://images.unsplash.com/photo-1507477338202-487281e6c27e'
    }
  ];

  for (const product of products) {
    await db.product.create({ data: product });
  }

  console.log('Seeded admin:', admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
