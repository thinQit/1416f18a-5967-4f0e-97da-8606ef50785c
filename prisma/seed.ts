import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('AdminPass123!', 10);
  const userPassword = await bcrypt.hash('UserPass123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: adminPassword,
      role: 'admin'
    }
  });

  const user = await prisma.user.create({
    data: {
      name: 'Jamie Doe',
      email: 'user@example.com',
      password_hash: userPassword,
      role: 'user'
    }
  });

  const products = [
    {
      name: 'Studio Backpack',
      description: 'Durable backpack with multiple compartments and ergonomic straps.',
      price: 96,
      quantity: 42,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab']
    },
    {
      name: 'Evergreen Chair',
      description: 'Modern lounge chair with soft upholstery and solid wood frame.',
      price: 240,
      quantity: 18,
      images: ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4']
    },
    {
      name: 'Aurora Lamp',
      description: 'Minimalist desk lamp with adjustable neck and warm lighting.',
      price: 68,
      quantity: 60,
      images: ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4']
    },
    {
      name: 'Nimbus Desk',
      description: 'Spacious desk with cable management and smooth matte finish.',
      price: 320,
      quantity: 9,
      images: ['https://images.unsplash.com/photo-1493666438817-866a91353ca9']
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        images: JSON.stringify(product.images),
        created_by_user_id: admin.id
      }
    });
  }

  await prisma.product.create({
    data: {
      name: 'Coastal Mug',
      description: 'Ceramic mug with coastal glaze pattern and comfortable grip.',
      price: 24,
      quantity: 120,
      images: JSON.stringify(['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085']),
      created_by_user_id: user.id
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
