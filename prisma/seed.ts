import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'admin'
    }
  });

  const user = await prisma.user.create({
    data: {
      name: 'Jane Customer',
      email: 'user@example.com',
      passwordHash: userPassword,
      role: 'user'
    }
  });

  const products = [
    {
      name: 'Aurora Desk Lamp',
      description: 'Warm LED desk lamp with adjustable brightness and USB charging.',
      price: 49.99,
      sku: 'LAMP-AUR-001',
      inventoryCount: 120,
      images: ['https://images.example.com/lamp-1.jpg']
    },
    {
      name: 'Nimbus Wireless Headphones',
      description: 'Noise-cancelling headphones with 30-hour battery life.',
      price: 129.5,
      sku: 'AUDIO-NIM-002',
      inventoryCount: 80,
      images: ['https://images.example.com/headphones-1.jpg']
    },
    {
      name: 'Summit Travel Backpack',
      description: 'Lightweight backpack with weather-resistant fabric and laptop sleeve.',
      price: 89.0,
      sku: 'PACK-SUM-003',
      inventoryCount: 60,
      images: ['https://images.example.com/backpack-1.jpg']
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku,
        inventoryCount: product.inventoryCount,
        images: JSON.stringify(product.images),
        createdBy: admin.id
      }
    });
  }

  await prisma.product.create({
    data: {
      name: 'Harbor Ceramic Mug',
      description: 'Minimalist ceramic mug with 12oz capacity.',
      price: 18.75,
      sku: 'MUG-HAR-004',
      inventoryCount: 150,
      images: JSON.stringify(['https://images.example.com/mug-1.jpg']),
      createdBy: user.id
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
