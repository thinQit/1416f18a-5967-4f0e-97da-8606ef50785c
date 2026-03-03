# Productly

Productly is a lightweight product management dashboard for teams to register/login, create and manage product listings with pricing, inventory, and images. It ships with REST APIs, admin UI, and role-based access control.

## Features
- JWT authentication with registration and login
- Product CRUD with pricing, inventory, images, and ownership checks
- Searchable, paginated product listings
- Role-based access (admin vs user)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Run Prisma migrations and seed:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/:id/images`

## Scripts
- `npm run dev` - Start Next.js dev server
- `npm run build` - Generate Prisma client and build
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
