# Multi-Tenant SaaS Research Document

## 1. Multi-Tenancy Architecture Analysis

Multi-tenancy is a core architectural concept in Software-as-a-Service (SaaS) applications where a single application instance serves multiple independent customers, known as tenants. Each tenant typically represents an organization with its own users, projects, and data. The primary challenge in multi-tenant systems is ensuring strict data isolation between tenants while maintaining scalability, performance, and operational efficiency. A well-designed multi-tenancy strategy allows SaaS providers to efficiently utilize infrastructure resources while delivering a secure and reliable experience to all tenants.

There are three commonly adopted multi-tenancy architecture approaches. Each approach differs in how tenant data is stored and isolated, and each has distinct advantages and trade-offs.

### 1.1 Shared Database + Shared Schema

In the shared database with shared schema approach, all tenants use the same physical database and the same set of tables. Tenant-specific data is logically separated using a `tenant_id` column that is present in every tenant-related table. All database queries executed by the application must include a filter condition on the `tenant_id` to ensure that only data belonging to the authenticated tenant is accessed.

**Advantages:**
- **Cost efficiency:** Only a single database and schema are required, significantly reducing infrastructure and maintenance costs.
- **Simplified schema management:** Database migrations and schema updates are applied once and automatically affect all tenants.
- **High scalability:** New tenants can be onboarded instantly without provisioning new databases or schemas.
- **Centralized monitoring:** Performance monitoring, backups, and logging are easier to manage with a single database.

**Disadvantages:**
- **Risk of data leakage:** A missing or incorrect `tenant_id` filter in queries can lead to accidental cross-tenant data exposure.
- **Limited customization:** All tenants must conform to the same database schema, making tenant-specific customization difficult.
- **Shared performance impact:** Heavy usage by one tenant may affect others if resource limits are not properly enforced.

This approach relies heavily on strong application-level controls, thorough testing, and strict enforcement of tenant isolation rules.

---

### 1.2 Shared Database + Separate Schema

In the shared database with separate schema approach, all tenants share the same physical database, but each tenant has its own dedicated schema within that database. Each schema contains a complete set of tables for that tenant, providing isolation at the schema level.

**Advantages:**
- **Improved data isolation:** Schema separation reduces the risk of accidental cross-tenant data access.
- **Greater flexibility:** Individual schemas can be extended or modified for specific tenants if required.
- **Simplified compliance:** Easier to meet certain regulatory or compliance requirements compared to a shared schema.

**Disadvantages:**
- **Operational complexity:** Managing migrations across multiple schemas increases development and operational overhead.
- **Scalability limitations:** A large number of schemas can make database management and tooling more complex.
- **Higher maintenance effort:** Schema creation, updates, and monitoring must be handled for each tenant.

While this approach offers stronger isolation than a shared schema, it becomes increasingly difficult to manage as the number of tenants grows.

---

### 1.3 Separate Database Per Tenant

In the separate database per tenant approach, each tenant is assigned a completely independent database instance. This provides the highest level of data isolation, as tenant data is physically separated at the database level.

**Advantages:**
- **Maximum isolation:** Eliminates the possibility of cross-tenant data access.
- **Strong compliance support:** Ideal for tenants with strict regulatory, security, or data residency requirements.
- **Independent scalability:** Each tenant’s database can be scaled based on its specific workload.

**Disadvantages:**
- **High infrastructure cost:** Maintaining a separate database for each tenant significantly increases cost.
- **Complex operations:** Backups, migrations, monitoring, and upgrades must be managed individually for each database.
- **Limited practicality:** Not suitable for SaaS platforms with a large number of small or medium tenants.

This approach is typically used for enterprise-grade customers rather than large-scale SaaS platforms serving many tenants.

---

### 1.4 Chosen Approach & Justification

For this project, the **Shared Database + Shared Schema with a `tenant_id` column** approach has been selected.

**Justification:**
- The project is designed to simulate a **scalable, real-world SaaS platform** capable of supporting multiple tenants efficiently.
- Infrastructure simplicity and ease of deployment are important evaluation criteria, making this approach well-suited for the project.
- Subscription plans and tenant-specific limits can be enforced effectively at the application layer.
- Strong data isolation is ensured through multiple safeguards:
  - Mandatory `tenant_id` columns on all tenant-specific tables
  - Middleware that automatically injects `tenant_id` filters into database queries using values extracted from JWT tokens
  - Strict role-based access control (RBAC) enforced at the API level
- This architecture mirrors patterns used by many modern SaaS platforms that successfully serve thousands of organizations using a shared database model.

Although this approach requires careful implementation to prevent data leakage, the combination of database constraints, application-level isolation logic, authentication controls, and comprehensive testing ensures secure and reliable tenant isolation. Given the project scope, scalability goals, and evaluation requirements, this architecture provides the best balance between security, performance, and maintainability.

## 2. Technology Stack Justification

Selecting the right technology stack is critical for building a secure, scalable, and maintainable multi-tenant SaaS application. The chosen technologies for this project were selected based on industry best practices, ease of development, community support, performance, and suitability for implementing multi-tenancy, role-based access control, and containerized deployment.

---

### 2.1 Backend Framework

The backend of this application is built using **Node.js with the Express.js framework**.

**Justification:**
- Express.js provides a lightweight and flexible framework for building RESTful APIs.
- Middleware-based architecture makes it easy to implement authentication, authorization, tenant isolation, and error handling.
- Node.js offers excellent performance for I/O-bound operations, which is ideal for API-driven SaaS applications.
- A large ecosystem of libraries simplifies integration of JWT authentication, input validation, and database access.
- Strong community support ensures long-term maintainability and availability of best practices.

**Alternatives Considered:**
- **Django / Django REST Framework:** Provides strong built-in features but can be heavier and less flexible for fine-grained middleware control.
- **Spring Boot:** Enterprise-grade but requires more boilerplate and higher resource usage.
- **FastAPI:** High performance but less mature ecosystem compared to Express for SaaS tooling.

---

### 2.2 Frontend Framework

The frontend application is built using **React.js**.

**Justification:**
- React’s component-based architecture enables reusable and maintainable UI components.
- Supports efficient state management and conditional rendering for role-based UI access.
- Large ecosystem and community support for UI libraries, routing, and API integration.
- Works seamlessly with REST APIs and token-based authentication.
- Ideal for building responsive, single-page applications required for modern SaaS platforms.

**Alternatives Considered:**
- **Angular:** Powerful but has a steeper learning curve and more complex architecture.
- **Vue.js:** Lightweight and simple, but React has broader ecosystem support and adoption.

---

### 2.3 Database

The application uses **PostgreSQL** as the relational database.

**Justification:**
- PostgreSQL provides strong support for relational data, constraints, and transactions.
- Excellent performance and reliability for multi-tenant workloads.
- Supports advanced indexing, foreign keys, and cascading deletes required for tenant isolation.
- ACID compliance ensures data consistency, especially during critical operations such as tenant registration.
- Widely adopted in production SaaS systems.

**Alternatives Considered:**
- **MySQL:** Reliable but less feature-rich for complex queries and constraints.
- **MongoDB:** Schema flexibility but not ideal for enforcing relational constraints and joins required in this project.

---

### 2.4 Authentication & Authorization

Authentication and authorization are implemented using **JSON Web Tokens (JWT)** with **Role-Based Access Control (RBAC)**.

**Justification:**
- JWT provides stateless authentication, which scales well in containerized and distributed environments.
- Tokens include user identity, tenant ID, and role information, enabling efficient authorization checks.
- Eliminates the need for server-side session storage.
- RBAC allows fine-grained access control for super admin, tenant admin, and regular users.
- Industry-standard approach widely used in modern SaaS platforms.

**Alternatives Considered:**
- **Session-based authentication:** Requires server-side storage and is less scalable.
- **OAuth2 providers:** Powerful but unnecessary for the scope of this project.

---

### 2.5 Deployment & Containerization

The application is fully containerized using **Docker and Docker Compose**.

**Justification:**
- Docker ensures consistent runtime environments across development, testing, and evaluation.
- Docker Compose allows all services (database, backend, frontend) to be started with a single command.
- Simplifies dependency management and service orchestration.
- Mandatory requirement for automated evaluation and reproducibility.
- Enables easy scaling and isolation of services.

**Alternatives Considered:**
- **Manual local setup:** Error-prone and inconsistent across systems.
- **Virtual machines:** Heavier and slower compared to container-based deployment.
- **Kubernetes:** Powerful but unnecessary for the scope of this project.

---

### 2.6 Alternatives Considered

While multiple technology options were evaluated, the final stack was chosen to balance simplicity, scalability, and industry relevance. The selected technologies are widely used in real-world SaaS platforms and provide strong support for multi-tenancy, security, and containerized deployment. This stack ensures that the application remains maintainable, scalable, and aligned with modern software engineering best practices.

## 3. Security Considerations

Security is a critical aspect of any multi-tenant SaaS application, as multiple organizations share the same application infrastructure. A security flaw in one area can potentially impact multiple tenants if not handled correctly. This project incorporates multiple layers of security controls to ensure strict tenant isolation, secure authentication, and protection against common web application vulnerabilities.

---

### 3.1 Data Isolation Strategy

Data isolation is the most important security requirement in a multi-tenant system. In this application, data isolation is enforced using a combination of database design and application-level controls.

Each tenant-specific table includes a mandatory `tenant_id` column, which uniquely identifies the tenant that owns the data. All database queries executed by the backend are filtered using the `tenant_id` extracted from the authenticated user’s JWT token. The application never trusts tenant identifiers provided by the client in request bodies or query parameters.

To further strengthen isolation:
- Super admin users are explicitly excluded from tenant-scoped queries and have `tenant_id = NULL`.
- Middleware automatically injects tenant filters into all relevant queries.
- Foreign key constraints ensure that records cannot be associated with invalid tenants.
- Indexes on `tenant_id` columns improve query performance and reduce the risk of accidental full-table scans.

This layered approach ensures that even if a malicious request is crafted, cross-tenant data access is prevented.

---

### 3.2 Authentication & Authorization

Authentication is implemented using JSON Web Tokens (JWT) with a 24-hour expiration time. Upon successful login, the backend issues a signed JWT containing only the required claims: user ID, tenant ID, and role. No sensitive information such as passwords is ever included in the token payload.

Authorization is enforced using Role-Based Access Control (RBAC). The system defines three roles:
- **Super Admin:** System-level administrator with access to all tenants.
- **Tenant Admin:** Administrator with full control over users, projects, and settings within their tenant.
- **User:** Regular team member with limited permissions.

Each API endpoint enforces authorization rules at the middleware level. Requests that do not meet role or tenant requirements are rejected with appropriate HTTP status codes such as 401 (Unauthorized) or 403 (Forbidden). This ensures that users can only perform actions that are explicitly permitted by their role.

---

### 3.3 Password Hashing

All user passwords are securely stored using strong cryptographic hashing. Plaintext passwords are never stored or logged at any point in the system.

Passwords are hashed using industry-standard algorithms such as **bcrypt** or **argon2**, which provide:
- Adaptive hashing with configurable cost factors
- Built-in protection against rainbow table attacks
- Resistance to brute-force attacks

During authentication, the provided password is hashed and compared with the stored hash. This ensures that even if the database is compromised, user credentials remain protected.

---

### 3.4 API Security Measures

Multiple API-level security measures are implemented to protect the application from common threats:

- **Input validation:** All incoming requests are validated to ensure required fields, data types, and formats are correct.
- **Consistent error handling:** Error responses avoid leaking sensitive system or database details.
- **HTTP status codes:** Proper status codes are used to clearly indicate authentication, authorization, and validation errors.
- **Rate limiting (conceptual):** API endpoints are designed to support rate limiting to protect against brute-force and denial-of-service attacks.
- **CORS configuration:** Cross-Origin Resource Sharing is restricted to trusted frontend origins only.
- **HTTPS readiness:** The application is designed to run behind HTTPS in production environments.

These measures significantly reduce the attack surface of the application.

---

### 3.5 Additional Security Best Practices

In addition to core security controls, the application follows several best practices to enhance overall security posture:

- **Audit logging:** All critical actions such as user creation, deletion, and project updates are logged in the audit_logs table.
- **Principle of least privilege:** Users are granted only the permissions required to perform their role.
- **Transaction safety:** Critical operations such as tenant registration are wrapped in database transactions to prevent partial failures.
- **Environment-based configuration:** Sensitive configuration values are stored in environment variables, not hardcoded.
- **Secure defaults:** New tenants are assigned safe default subscription limits and roles.

By combining strong authentication, strict authorization, robust data isolation, and defensive coding practices, this project demonstrates a secure and production-ready approach to building multi-tenant SaaS applications.
