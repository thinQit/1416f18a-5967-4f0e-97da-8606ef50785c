# MerchMate

MerchMate is a lightweight admin & storefront dashboard for managing products and users. It provides JWT-based authentication, product CRUD operations, and a responsive UI for inventory management.

## Features
- User registration and login with JWT cookies
- Product CRUD with pagination and search
- Protected routes and API endpoints
- Image upload endpoint (placeholder URL)
- Prisma + SQLite for local development

## Setup
1. Copy `.env.example` to `.env` and update values.
2. Install dependencies and generate Prisma client:
   ```bash
   npm install
   npx prisma generate
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/uploads`

## Notes
- Uploads endpoint returns a placeholder URL for now.
- Update middleware to fit production auth requirements.
