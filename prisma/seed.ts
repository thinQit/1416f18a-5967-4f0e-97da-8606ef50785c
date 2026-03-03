import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const admin = await db.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'admin'
    }
  });

  const user = await db.user.create({
    data: {
      name: 'Jamie Customer',
      email: 'user@example.com',
      passwordHash: userPassword,
      role: 'user'
    }
  });

  await db.product.create({
    data: {
      name: 'Wireless Headphones',
      description: 'Noise-cancelling over-ear headphones with 30-hour battery life.',
      price: 199.99,
      sku: 'WH-1000XM',
      stock: 45,
      images: JSON.stringify([
        'https://images.example.com/products/headphones-1.jpg',
        'https://images.example.com/products/headphones-2.jpg'
      ]),
      createdBy: admin.id
    }
  });

  await db.product.create({
    data: {
      name: 'Smart Home Hub',
      description: 'Voice-controlled smart hub with Wi-Fi and Bluetooth connectivity.',
      price: 129.5,
      sku: 'HUB-200',
      stock: 120,
      images: JSON.stringify(['https://images.example.com/products/hub-1.jpg']),
      createdBy: admin.id
    }
  });

  await db.product.create({
    data: {
      name: 'Ergonomic Office Chair',
      description: 'Adjustable chair with lumbar support for all-day comfort.',
      price: 299.0,
      sku: 'CHAIR-ERG',
      stock: 25,
      images: JSON.stringify([
        'https://images.example.com/products/chair-1.jpg',
        'https://images.example.com/products/chair-2.jpg'
      ]),
      createdBy: user.id
    }
  });
}

main()
  .catch((error: unknown) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
