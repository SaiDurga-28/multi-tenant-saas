# Multi-Tenant SaaS Platform

A production-ready **multi-tenant SaaS application** that allows multiple organizations (tenants) to manage users, projects, and tasks with **strict tenant isolation**, **role-based access control**, and **Dockerized deployment**.

---

## Features

- Multi-tenant architecture with complete data isolation
- JWT-based authentication
- Role-Based Access Control (Super Admin, Tenant Admin, User)
- Project and task management
- Subscription plan limits
- Dockerized backend, frontend, and database
- Automatic database migrations and seed data
- Health check endpoint for system monitoring

---

## Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React (Vite)

### DevOps
- Docker
- Docker Compose

---

## Project Structure

```
multi-tenant-saas/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── utils/
│ │ └── app.js
│ ├── database/
│ │ └── init/
│ │ ├── 001_create_tables.sql
│ │ └── 001_seed_data.sql
│ ├── Dockerfile
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── Dockerfile
│ └── package.json
│
├── docs/
│ ├── research.md
│ ├── PRD.md
│ ├── architecture.md
│ ├── technical-spec.md
│ ├── API.md
│ └── images/
│
├── docker-compose.yml
├── submission.json
└── README.md

```

## Environment Setup (Docker)

This application is fully dockerized and can be evaluated using a single command: docker-compose up -d


### Prerequisites
- Docker
- Docker Compose

### Run the Application
```bash
docker-compose up -d
```
All services will start automatically:

 Database migrations run automatically 

 Seed data is loaded automatically 

 No manual commands required 

### Service URLs

- Frontend: http://localhost:3000

- Backend API: http://localhost:5000

- Health Check: http://localhost:5000/api/health

### Test Credentials
 All test credentials used for evaluation are documented in: 

submission.json

 Includes: 

Super Admin

Tenant Admin

Regular User

Sample tenant, project, and task data

### API Documentation
 Complete API documentation for all endpoints is available at: 

docs/API.md

### Health Check
- The backend exposes a mandatory health check endpoint:

GET /api/health

- Response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "ISO-date"
}
```
### Demo Video
A full demo video covering architecture, features, and application flow is available here:

- Demo Video Link: https://drive.google.com/file/d/1yJCdly7eeq6HIpdK036FE1sqfrF-2M3B/view?usp=drive_link

### Notes
Tenant data is fully isolated using tenant_id

JWT tokens include userId, tenantId, and role

All services communicate via Docker service names

Database persistence is handled via Docker volumes
