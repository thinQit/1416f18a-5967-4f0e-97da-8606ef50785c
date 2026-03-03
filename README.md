# ProdBoard

ProdBoard is a lightweight product management dashboard that provides user registration/login, product CRUD (create, read, update, delete), and a product listing dashboard. It includes REST APIs, JWT-based auth, and simple role support so admin users can manage inventory while regular users can view products.

## Features
- JWT-based authentication with role support (admin/user)
- Product listing with pagination and category filtering
- Admin product create/update/delete
- REST API endpoints for products and authentication

## Setup
1. Copy `.env.example` to `.env` and update values.
2. Install dependencies: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. Run dev server: `npm run dev`

## API Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `POST /api/uploads/image`

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run test`
