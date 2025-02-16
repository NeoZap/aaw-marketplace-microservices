# Marketplace API (Microservices)

## Overview

REST API for a marketplace application built with Express.js, PostgreSQL, and Drizzle ORM. The API is split into multiple microservices for authentication, orders, products, tenants, and wishlists.

## Prerequisites

- Node.js 18.18.2
- pnpm
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>

# Copy environment file
cp .env.example .env

# Start with Docker Compose
docker compose up
```

## Local Development Setup

```bash
chmod +x start-and-migrate.sh
./start-and-migrate.sh
```

## Environment Variables

Copy .env.example to .env and configure:

```
TENANT_ID=47dd6b24-0b23-46b0-a662-776158d089ba
JWT_SECRET=auth_ms_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
PORT=8000
NODE_ENV=development

```

## Available Scripts

```bash
pnpm dev # Development mode with hot reload
pnpm build # Build production
pnpm start # Start production server
pnpm generate # Generate DB migrations
pnpm migrate # Run DB migrations
```

## Microservice URL

* Auth Microservice URL: http://localhost:8000
* Orders Microservice URL: http://localhost:8001
* Products Microservice URL: http://localhost:8002
* Tenant Microservice URL: http://localhost:8003
* Wishlist Microservice URL: http://localhost:8004

## API Endpoints

* Authentication:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-token
POST /api/auth/verify-admin-token
GET /health
GET /
```
* Orders Microservice:
```
GET /api/order
GET /api/order/:orderId
POST /api/order
POST /api/order/:orderId/pay
POST /api/order/:orderId/cancel
GET /api/cart
POST /api/cart
PUT /api/cart
DELETE /api/cart
GET /health
GET /
```
* Products Microservice:
```
GET /api/product
GET /api/product/category
GET /api/product/:id
POST /api/product/many
GET /api/product/category/:category_id
POST /api/product
POST /api/product/category
PUT /api/product/:id
PUT /api/product/category/:category_id
DELETE /api/product/:id
DELETE /api/product/category/:category_id
GET /health
GET /
```
* Tenant Microservice:
```
GET /api/tenant/:tenant_id
POST /api/tenant
PUT /api/tenant/:old_tenant_id
DELETE /api/tenant
GET /health
GET /
```
* Wishlist Microservice:
```
GET /api/wishlist
GET /api/wishlist/:id
POST /api/wishlist
PUT /api/wishlist/:id
DELETE /api/wishlist/remove
DELETE /api/wishlist/:id
POST /api/wishlist/add
GET /health
GET /
```

## Database Schema

Managed through Drizzle ORM with migrations in drizzle directory.
