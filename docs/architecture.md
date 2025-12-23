# System Architecture Document
## Multi-Tenant SaaS Platform – Project & Task Management System

---

## 1. Overview

This document describes the system architecture of the Multi-Tenant SaaS Platform. The architecture is designed to support multiple organizations (tenants) within a single application while ensuring strict data isolation, role-based access control, scalability, and secure access.

The system follows a layered, service-oriented architecture consisting of a frontend client, a backend API server, and a relational database. All components are containerized using Docker and orchestrated using Docker Compose.

---

## 2. High-Level System Architecture

### 2.1 Architecture Description

The system consists of the following main components:

1. **Client (Browser)**
   - Users access the application through a web browser.
   - Requests are sent to the frontend application.

2. **Frontend Application**
   - A single-page application responsible for user interface and user interactions.
   - Handles authentication state, role-based UI rendering, and API communication.
   - Communicates with the backend API using HTTP/REST.

3. **Backend API Server**
   - Exposes RESTful API endpoints for authentication, tenant management, user management, project management, and task management.
   - Implements business logic, validation, authorization, and tenant isolation.
   - Issues and validates JWT tokens.
   - Logs critical actions to the audit_logs table.

4. **Database (PostgreSQL)**
   - Stores all tenant, user, project, task, and audit log data.
   - Enforces relational integrity, constraints, and cascading rules.
   - Ensures persistent storage across container restarts.

### 2.2 Authentication Flow

1. User submits login credentials along with tenant subdomain.
2. Backend validates credentials and tenant status.
3. Backend issues a JWT token containing userId, tenantId, and role.
4. Frontend stores the token securely.
5. Token is included in the Authorization header for subsequent API requests.
6. Backend middleware validates the token and enforces access control.

### 2.3 Architecture Diagram

The high-level system architecture is illustrated in the following diagram:

**File:**  
`docs/images/system-architecture.png`

The diagram shows:
- Browser → Frontend
- Frontend → Backend API
- Backend API → Database
- JWT-based authentication flow
- Tenant isolation at the API and database layers

---

## 3. Database Architecture

### 3.1 Database Design Overview

The database follows a shared-database, shared-schema multi-tenancy model. All tenant-specific data includes a `tenant_id` column to ensure logical isolation.

### 3.2 Core Tables

- **tenants** – Stores tenant (organization) details and subscription limits
- **users** – Stores user accounts and roles
- **projects** – Stores projects created within a tenant
- **tasks** – Stores tasks associated with projects
- **audit_logs** – Records critical system actions for auditing

Super admin users are stored in the users table with `tenant_id = NULL`.

### 3.3 Entity Relationship Diagram (ERD)

The database structure and relationships are illustrated in the ERD diagram:

**File:**  
`docs/images/database-erd.png`

The ERD highlights:
- Foreign key relationships
- Cascading delete rules
- Indexed tenant_id columns
- One-to-many relationships between tenants and users/projects/tasks

---

## 4. API Architecture

The backend exposes a total of **19 RESTful API endpoints**, organized into logical modules. All endpoints follow a consistent response format and enforce authentication and authorization where required.

### 4.1 Authentication Module

| API | Method | Endpoint | Authentication | Authorization |
|----|--------|----------|----------------|---------------|
| API-01 | POST | /api/auth/register-tenant | No | Public |
| API-02 | POST | /api/auth/login | No | Public |
| API-03 | GET | /api/auth/me | Yes | Any authenticated user |
| API-04 | POST | /api/auth/logout | Yes | Any authenticated user |

---

### 4.2 Tenant Management Module

| API | Method | Endpoint | Authentication | Authorization |
|----|--------|----------|----------------|---------------|
| API-05 | GET | /api/tenants/:tenantId | Yes | Tenant member or Super Admin |
| API-06 | PUT | /api/tenants/:tenantId | Yes | Tenant Admin or Super Admin |
| API-07 | GET | /api/tenants | Yes | Super Admin only |

---

### 4.3 User Management Module

| API | Method | Endpoint | Authentication | Authorization |
|----|--------|----------|----------------|---------------|
| API-08 | POST | /api/tenants/:tenantId/users | Yes | Tenant Admin |
| API-09 | GET | /api/tenants/:tenantId/users | Yes | Tenant member |
| API-10 | PUT | /api/users/:userId | Yes | Tenant Admin or Self |
| API-11 | DELETE | /api/users/:userId | Yes | Tenant Admin |

---

### 4.4 Project Management Module

| API | Method | Endpoint | Authentication | Authorization |
|----|--------|----------|----------------|---------------|
| API-12 | POST | /api/projects | Yes | Tenant member |
| API-13 | GET | /api/projects | Yes | Tenant member |
| API-14 | PUT | /api/projects/:projectId | Yes | Tenant Admin or Project Creator |
| API-15 | DELETE | /api/projects/:projectId | Yes | Tenant Admin or Project Creator |

---

### 4.5 Task Management Module

| API | Method | Endpoint | Authentication | Authorization |
|----|--------|----------|----------------|---------------|
| API-16 | POST | /api/projects/:projectId/tasks | Yes | Tenant member |
| API-17 | GET | /api/projects/:projectId/tasks | Yes | Tenant member |
| API-18 | PATCH | /api/tasks/:taskId/status | Yes | Tenant member |
| API-19 | PUT | /api/tasks/:taskId | Yes | Tenant member |

---

## 5. Tenant Isolation & Security Architecture

- Tenant ID is extracted from JWT tokens and never trusted from client input.
- Middleware enforces tenant-based query filtering.
- Super admin access bypasses tenant restrictions where appropriate.
- Role-based access control is enforced at the API layer.
- Audit logging tracks all critical system actions.

---

## 6. Conclusion

This architecture provides a secure, scalable, and maintainable foundation for a multi-tenant SaaS application. By combining a shared-database multi-tenancy model with strong application-level controls, role-based authorization, and containerized deployment, the system meets both functional and non-functional requirements and is well-suited for production-ready evaluation.
