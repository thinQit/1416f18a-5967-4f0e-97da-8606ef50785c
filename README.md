# Product Management App

A simple CRUD product management web app with user authentication and an admin dashboard. Users can register, log in, and manage products. The app provides REST APIs, a health check endpoint, and a responsive UI scaffold.

## Features
- User registration and login with JWT authentication
- Product CRUD with ownership checks and soft delete
- Public product listing with pagination and filters
- Admin dashboard metrics endpoint
- Health check endpoint
- Tailwind CSS styling and reusable UI components

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM (SQLite for development)
- JWT authentication + bcryptjs
- Tailwind CSS
- Jest + Testing Library
- Playwright

## Prerequisites
- Node.js 18+
- npm

## Quick Start
### macOS/Linux
```bash
./install.sh
npm run dev
```

### Windows (PowerShell)
```powershell
./install.ps1
npm run dev
```

## Environment Variables
See `.env.example`:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`

## Project Structure
```
src/
  app/                # Next.js App Router pages & API routes
  components/         # Reusable UI components
  providers/          # Context providers
  lib/                # Utilities and services
  types/              # Shared TypeScript types
prisma/               # Prisma schema and migrations
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
- `GET /api/dashboard/metrics`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes Prisma generate)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:e2e` - Run Playwright tests

## Testing
- Unit tests with Jest
- E2E tests with Playwright

## Notes
- All protected endpoints require a Bearer token.
- Product deletion is soft delete by default.
- Prisma schema avoids enums for SQLite compatibility.
