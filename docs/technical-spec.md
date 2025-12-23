# Technical Specification
## Multi-Tenant SaaS Platform – Project & Task Management System

---

## 1. Overview

This document provides the technical specifications for implementing the Multi-Tenant SaaS Platform. It describes the project structure, development setup, environment configuration, and Docker-based deployment strategy. The goal of this specification is to ensure the application is easy to understand, build, run, and evaluate in a consistent environment.

The application follows a containerized, service-oriented architecture consisting of:
- Frontend (React)
- Backend API (Node.js + Express)
- Database (PostgreSQL)

All services are orchestrated using Docker Compose and can be started using a single command.

---

## 2. Project Structure

### 2.1 Root Directory Structure

```
multi-tenant-saas/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── utils/
│ │ └── app.js
│ ├── migrations/
│ ├── seeds/
│ ├── Dockerfile
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── routes/
│ │ └── App.js
│ ├── Dockerfile
│ └── package.json
│
├── docs/
│ ├── images/
│ │ ├── system-architecture.png
│ │ └── database-erd.png
│ ├── research.md
│ ├── PRD.md
│ ├── architecture.md
│ └── technical-spec.md
│
├── docker-compose.yml
├── submission.json
├── .env
├── .gitignore
└── README.md
```

## 3. Backend Technical Details

### 3.1 Backend Framework
- **Node.js**
- **Express.js**

### 3.2 Responsibilities
- Authentication and authorization using JWT
- Role-Based Access Control (RBAC)
- Tenant isolation using `tenant_id`
- Business logic for tenants, users, projects, and tasks
- Database migrations and seed data execution
- Health check endpoint for Docker evaluation

### 3.3 Middleware
- Authentication middleware (JWT validation)
- Authorization middleware (role checks)
- Tenant isolation middleware
- Global error handling middleware
- Request validation middleware

### 3.4 Database Access
- PostgreSQL database
- ORM or query builder (e.g., Sequelize / Knex)
- Transactions used for critical operations such as tenant creation

---

## 4. Frontend Technical Details

### 4.1 Frontend Framework
- **React.js**

### 4.2 Responsibilities
- User authentication and token management
- Role-based routing and UI rendering
- API integration with backend services
- Forms and dashboards for users, projects, and tasks
- Responsive design for desktop and mobile

### 4.3 Frontend–Backend Communication
- RESTful APIs
- JWT token sent via `Authorization: Bearer <token>` header
- Centralized API service layer for HTTP requests

---

## 5. Database Technical Details

### 5.1 Database
- **PostgreSQL**

### 5.2 Multi-Tenancy Strategy
- Shared database and shared schema
- Mandatory `tenant_id` column on all tenant-specific tables
- Super admin users stored with `tenant_id = NULL`

### 5.3 Core Tables
- tenants
- users
- projects
- tasks
- audit_logs

### 5.4 Constraints and Integrity
- Foreign key constraints enforce data relationships
- Indexes on `tenant_id` for performance
- Cascading deletes where appropriate

---

## 6. Environment Configuration

### 6.1 Environment Variables

All environment variables are available in the repository and accessible to Docker containers.

Example `.env` file:

```env
NODE_ENV=development

# Backend
BACKEND_PORT=5000
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=24h

# Database
DB_HOST=database
DB_PORT=5432
DB_NAME=multitenant_saas
DB_USER=postgres
DB_PASSWORD=postgres

# Frontend
REACT_APP_API_URL=http://localhost:5000
```


## 7. Docker & Containerization

### 7.1 Services

The application consists of three Docker services:
- **database** (PostgreSQL)
- **backend** (Node.js + Express)
- **frontend** (React)

### 7.2 Docker Compose

All services are started using:

```bash
docker-compose up -d
```

### 7.3 Fixed Port Mappings

Database: 5432:5432

Backend: 5000:5000

Frontend: 3000:3000

### 7.4 Automatic Initialization

Database migrations run automatically when the backend starts

Seed data loads automatically after migrations

No manual commands are required

## 8. Health Check

The backend exposes a health check endpoint:

GET /api/health


This endpoint returns a success response when the application and database connection are healthy. It is used by the evaluation process to verify service readiness.

## 9. Development Workflow
### 9.1 Local Development

Docker is the recommended development environment

Code changes require rebuilding containers if dependencies change

### 9.2 Version Control

Git is used for source control

Small, meaningful commits are encouraged

Minimum of 30 commits by final submission

## 10. Conclusion

This technical specification defines the complete implementation and deployment strategy for the Multi-Tenant SaaS Platform. By following this structure and configuration, the application remains consistent, scalable, secure, and easy to evaluate. The combination of Docker-based deployment, strict tenant isolation, and modular architecture ensures production-ready quality and reproducibility.

---

