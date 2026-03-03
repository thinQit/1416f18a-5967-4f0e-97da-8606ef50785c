# ShopFlow

ShopFlow is a TypeScript-based admin + storefront starter for managing users and products. It includes registration/login with JWT auth, product CRUD APIs, a responsive storefront UI, and an admin dashboard.

## Features
- JWT-based authentication with bcrypt password hashing
- Product CRUD with pagination and search
- Admin dashboard with catalog insights
- Responsive UI built with Next.js 14 + Tailwind CSS
- Prisma ORM with SQLite for local development

## Setup
1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Run the app:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/users/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (auth required, admin role)
- `PATCH /api/products/:id` (auth required, admin role)
- `DELETE /api/products/:id` (auth required, admin role)
- `POST /api/products/:id/images` (auth required, admin role)

## Notes
- Product management routes enforce an `admin` role. Update a user role directly in the database for testing.
- Store JWT tokens in `localStorage` under `shopflow_token`.
