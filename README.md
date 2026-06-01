# Task Management System

✓ 31/31 Tests Passing  
✓ 88.5% Coverage  
✓ Swagger/OpenAPI  
✓ JWT + Refresh Tokens  
✓ RBAC  
✓ Docker  
✓ PostgreSQL + Prisma

Task Management System built with Node.js, Express, PostgreSQL, Prisma, React, JWT Authentication, RBAC, Swagger, Docker, and Automated Testing.

## Overview

This project is a full-stack Task Management System developed as a Backend Developer Internship assignment. It demonstrates a scalable, secure, and fully-tested architecture suitable for production deployments.

## Highlights

- 31/31 Automated Tests Passing
- 88.5% Test Coverage
- JWT Authentication + Refresh Tokens
- Role-Based Access Control (RBAC)
- PostgreSQL + Prisma ORM
- Swagger/OpenAPI Documentation
- Dockerized Deployment
- Soft Deletes
- Search, Filtering & Pagination

## Architecture

The project follows a layered architecture: Controller → Service → Prisma. This separation improves maintainability, testability, and scalability.

```mermaid
graph TD
    Client[Client React App] -->|HTTP Axios + JWT Bearer| API_Gateway[API Gateway Express]
    API_Gateway --> Routes[Routes /api/v1/*]
    Routes --> Middleware[Middleware Auth, Role, Validate, RateLimit]
    Middleware --> Controllers[Controllers HTTP ↔ Service bridge]
    Controllers --> Services[Services Business logic]
    Services --> Prisma[Prisma ORM]
    Prisma --> DB[(PostgreSQL)]
```

### Request Flow

Client
↓
JWT Authentication Middleware
↓
Validation Middleware (Zod)
↓
Controller
↓
Service
↓
Prisma ORM
↓
PostgreSQL

## Design Decisions

**Why Prisma?**
- Type-safe ORM
- Built-in migration support
- Excellent developer experience and autocompletion

**Why PostgreSQL?**
- Strong relational integrity
- ACID compliance
- High scalability for complex queries

**Why Service Layer Architecture?**
- Separation of concerns (keeps controllers thin)
- Easier unit and integration testing
- Business logic is reusable across different routes or protocols

## Tech Stack

### Backend
- Node.js & Express.js
- PostgreSQL & Prisma ORM
- JWT Authentication
- Zod Validation
- Swagger/OpenAPI
- Winston Logging
- Jest & Supertest

### Frontend
- React & Vite
- Axios
- React Router

### DevOps
- Docker & Docker Compose
- GitHub Actions CI/CD

## Features

### Core Features
- User Registration & Login
- Task CRUD Operations (Create, Read, Update, Delete)
- Soft Deletes for Tasks
- Search, Pagination, Status & Priority Filtering
- Admin Dashboard (View/Block Users, Manage Any Task)

### Security Features
- **Authentication**: Access Tokens (15 minutes), Refresh Tokens (7 days)
- **Authorization**: Strict Role-Based Access Control (User vs Admin)
- **Data Protection**: bcrypt password hashing (12 rounds), Zod Input Validation, XSS Sanitization, Helmet Security Headers, Request Rate Limiting

### Developer Features
- Swagger/OpenAPI Documentation
- Docker & Docker Compose Support
- Winston Structured Logging
- Automated Testing Pipeline (CI/CD via GitHub Actions)
- Prisma Migrations

## Database Schema

```mermaid
erDiagram
    USER ||--o{ TASK : owns
    USER {
        String id PK
        String name
        String email UK
        String password
        String role
        Boolean isBlocked
    }
    TASK {
        String id PK
        String title
        String description
        String status
        String priority
        DateTime deletedAt
        String userId FK
    }
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/v1/auth/register` | Register new user |
| **POST** | `/api/v1/auth/login` | Login user |
| **POST** | `/api/v1/auth/refresh` | Refresh JWT access token |
| **POST** | `/api/v1/tasks` | Create a new task |
| **GET** | `/api/v1/tasks` | Get paginated & filtered tasks |
| **GET** | `/api/v1/tasks/:id` | Get specific task details |
| **PUT** | `/api/v1/tasks/:id` | Update specific task |
| **DELETE** | `/api/v1/tasks/:id` | Soft delete a task |
| **GET** | `/api/v1/admin/users` | View all users (Admin only) |
| **PATCH** | `/api/v1/admin/users/:id/block` | Block a user (Admin only) |
| **PATCH** | `/api/v1/admin/users/:id/unblock` | Unblock a user (Admin only) |
| **DELETE** | `/api/v1/admin/tasks/:id` | Delete any task (Admin only) |
| **GET** | `/api/v1/health` | System health check |

### Login Response Example

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "12345-uuid",
      "name": "John Doe",
      "email": "john@test.com",
      "role": "user"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "def456..."
  }
}
```

## Local Development

### Running the Project Locally

**Backend Server:** `http://localhost:5000`  
**Frontend React App:** `http://localhost:5173`  
**Swagger API Docs:** `http://localhost:5000/api-docs`  

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your database connections (e.g., Supabase or local PostgreSQL) and JWT secrets.
   ```bash
   cp .env.example .env
   ```

3. **Initialize Database & Start:**
   Push the schema to your database, seed the admin account, and start the server.
   ```bash
   npx prisma db push
   npx prisma generate
   npm run seed
   npm run dev
   ```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Docker

Start full stack via Docker Compose:

```bash
docker compose up --build -d
```

## Automated Testing

The backend includes a full test suite using Jest and Supertest. It utilizes a dedicated Docker container for a completely isolated test database.

### Test Coverage Areas
- Authentication & Session Integrity
- Refresh Tokens & Revocation
- Role-Based Access Control (RBAC)
- Ownership Security Checks
- Input Validation (Zod)
- Pagination & Search Constraints
- Soft Deletes
- Admin Operations

1. Ensure Docker Desktop is running.
2. Navigate to the backend directory and run the test sequence:

```bash
cd backend
npm run test:db:start     # Starts the isolated PostgreSQL test container
npm run test:prepare      # Runs Prisma migrations on the test DB
npm run test:coverage     # Runs all Jest tests and generates a coverage report
npm run test:db:stop      # Cleans up and shuts down the test container
```

## Scalability Architecture & Roadmap

As the system grows, the following architectural improvements are planned for horizontal scaling and high availability:

### 1. Caching Layer (Redis)
- **Data Caching:** Cache frequently accessed, read-heavy data like paginated task lists to reduce database load.
- **Session Management:** Store refresh tokens in Redis with a TTL matching their expiry for immediate token revocation upon logout.
- **Blacklisting:** Maintain a Redis-backed blacklist of revoked access tokens to handle forced logouts and password changes.

### 2. Database Scaling
- **Connection Pooling:** Utilize Supabase Session Pooler (PgBouncer) to efficiently manage thousands of concurrent connections.
- **Read Replicas:** Implement PostgreSQL read replicas for heavy `GET` requests (e.g., fetching task lists or admin reporting) while directing `POST/PUT/DELETE` traffic to the primary node.

### 3. Asynchronous Processing (Message Brokers)
- Integrate **RabbitMQ** or **Kafka** to handle background tasks asynchronously without blocking the main API thread.
- **Use cases:** Sending email notifications, generating daily/weekly activity reports, and processing bulk task imports.

### 4. Microservices Decomposition
- Split the current monolithic Express app into independent services if business domains grow large enough:
  - **Auth Service** (handles JWT, users, RBAC)
  - **Task Service** (handles CRUD and business logic for tasks)
  - **API Gateway** (routes requests, handles rate-limiting and global auth checks)

### 5. Deployment & Orchestration
- Migrate from Docker Compose to **Kubernetes (K8s)** to manage container replicas, handle auto-scaling based on CPU/Memory, and perform zero-downtime rolling updates.
- CI/CD pipelines (via GitHub Actions) are already implemented to automate testing and builds.

## Screenshots

### Login Page
![Login](<img width="1600" height="841" alt="WhatsApp Image 2026-06-01 at 10 27 54 PM" src="https://github.com/user-attachments/assets/9e357d89-d2ee-456e-966e-8259878f14b9" />
)

### User Dashboard
![User Dashboard](<img width="1600" height="834" alt="WhatsApp Image 2026-06-01 at 10 28 24 PM" src="https://github.com/user-attachments/assets/2e51783b-4e29-45a9-b545-4495fa4ea889" />
)

### Admin Dashboard
![Admin Dashboard](<img width="1600" height="775" alt="WhatsApp Image 2026-06-01 at 10 29 23 PM" src="https://github.com/user-attachments/assets/b0fa68a5-5ddf-4cde-950d-d5fd6a57b892" />
)

### Swagger Documentation
![Swagger Documentation](<img width="1600" height="827" alt="WhatsApp Image 2026-06-01 at 10 29 41 PM" src="https://github.com/user-attachments/assets/caf7db73-7cd1-4e54-86bf-864a100ab533" />
)

<img width="1600" height="825" alt="WhatsApp Image 2026-06-01 at 10 29 56 PM" src="https://github.com/user-attachments/assets/60874b60-e133-45d7-9c60-dcf036be0c3a" />

<img width="1600" height="840" alt="WhatsApp Image 2026-06-01 at 10 30 14 PM" src="https://github.com/user-attachments/assets/1017b9e6-3be1-439a-810d-658e6421928a" />


<img width="709" height="719" alt="WhatsApp Image 2026-06-01 at 11 25 30 PM" src="https://github.com/user-attachments/assets/2b74ca72-7c20-4707-ad84-f0cc1c071465" />

## Author

Yash Bhardwaj

Backend Developer Internship Assignment
