# ProdDash

ProdDash is a lightweight product management dashboard with authentication, product CRUD, and public product listings.

## Features
- User registration and login (JWT)
- Product listing with search and pagination
- Product details, create, update, delete
- Image upload endpoint (stubbed for CDN integration)

## Setup
1. Copy `.env.example` to `.env` and update values.
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Push schema: `npm run prisma:push`
5. Run dev server: `npm run dev`

## API Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/:id/image`

## Scripts
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run prisma:push`
- `npm run seed`
