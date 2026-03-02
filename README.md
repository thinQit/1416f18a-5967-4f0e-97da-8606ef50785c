# 1416f18a-5967-4f0e-97da-8606ef50785c

A simple product management web app with user authentication, product CRUD, and an admin dashboard. Includes registration/login flows, product listing and add-product screens, JWT-based security, and a health endpoint for service monitoring.

## Features
- JWT-based authentication (register/login)
- Role-based admin controls for product management
- Product listing with pagination and search
- Admin dashboard statistics
- Health endpoint for monitoring

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM (SQLite)
- Tailwind CSS
- Jest + Testing Library
- Playwright E2E

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
Create a `.env` file using `.env.example`:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-min-32-chars-change-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Project Structure
```
src/
  app/               # Next.js app router pages and API routes
  components/        # UI components and layout
  lib/               # Utilities, prisma client, auth helpers
  providers/         # React context providers
  types/             # Shared TypeScript types
prisma/              # Prisma schema and migrations
```

## API Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Generate Prisma client and build
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run Playwright E2E tests

## Testing
```bash
npm run test
npm run test:e2e
```

## Notes
- SQLite is used for local development. Update `DATABASE_URL` and Prisma provider for production databases.
- JWT is returned on login and registration. Use the token for authenticated requests.
