# Product Management App

A simple product management web app with user registration/login, product CRUD, and a product listing dashboard.

## Features
- User registration and login with JWT authentication
- Secure password hashing with bcryptjs
- Product listing with pagination and search
- Admin-only create, update, delete products
- Admin dashboard with overview and low-stock alerts
- Tailwind CSS-based responsive UI
- Prisma ORM with SQLite for local development

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM + SQLite
- Jest + Testing Library
- Playwright

## Prerequisites
- Node.js 18+
- npm 9+

## Quick Start
```bash
./install.sh
# or on Windows
./install.ps1
```
Then run:
```bash
npm run dev
```

## Environment Variables
See `.env.example` for required variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`

## Project Structure
```
src/
  app/           # Next.js routes
  app/api/       # API handlers
  components/    # UI components
  providers/     # App providers
  lib/           # Utilities and Prisma client
  types/         # Shared TypeScript types
prisma/          # Prisma schema
```

## API Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `GET /api/users/me`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest
- `npm run test:e2e` - Run Playwright

## Testing
```bash
npm run test
npm run test:e2e
```
