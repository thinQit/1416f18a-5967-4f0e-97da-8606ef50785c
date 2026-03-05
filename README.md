# Prodly

Prodly is a modern product catalog and auth dashboard built with Next.js 14 and Prisma. Teams can register, log in, and manage products with secure JWT sessions, searchable listings, and responsive UI workflows.

## Features
- JWT-based authentication with secure password hashing.
- Product CRUD API with pagination, search, and sorting.
- Responsive catalog UI for listing, creating, and managing products.
- Health endpoint and structured logging for observability.

## Getting Started
1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   ./install.sh
   ```
3. Run Prisma client generation:
   ```bash
   npm run prisma:generate
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/health` — Service status and uptime.
- `POST /api/auth/register` — Register a new user.
- `POST /api/auth/login` — Login and receive a JWT.
- `GET /api/users/me` — Current authenticated user.
- `GET /api/products` — Paginated products list with search/sort.
- `POST /api/products` — Create a new product (auth required).
- `GET /api/products/:id` — Product detail.
- `PUT /api/products/:id` — Update product (owner/admin).
- `DELETE /api/products/:id` — Delete product (owner/admin).
- `POST /api/products/:id/images` — Update product image list.

## Testing
- `npm test` — Run Jest test suite.
- `npx playwright test` — Run Playwright end-to-end tests.

## Notes
- SQLite is used for local development. Update `DATABASE_URL` to migrate to Postgres in production.
- Configure `JWT_SECRET` and other sensitive values in a secure secret manager in production.
