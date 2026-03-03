# My App

Simple product catalog web app with user authentication, product CRUD, and listing/dashboard UI.

## Features
- JWT-based authentication with refresh tokens
- User registration and login flows
- Product creation, update, deletion with authorization
- Public product listing with pagination and search
- Health check endpoint for monitoring

## Setup
1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npx prisma generate`
4. Run dev server:
   - `npm run dev`

## API Endpoints
- `GET /api/health`
- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

## Notes
- SQLite is used for local development.
- JWT secrets must be configured in environment variables.
