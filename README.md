# ShopFlow

ShopFlow is a lightweight product catalog and admin dashboard with JWT authentication, product CRUD, pagination, and image upload support.

## Features
- User registration and login with bcrypt-hashed passwords and JWT sessions
- Role-based access control for admin-only product management
- Product listing with search and pagination
- Product detail pages and admin dashboard overview
- REST API with Prisma + SQLite

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
4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/products`
- `POST /api/products` (admin)
- `GET /api/products/:id`
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/upload` (authenticated)

## Notes
- Set `JWT_SECRET` in production.
- Role-based access returns `403` for non-admin users on admin endpoints.
