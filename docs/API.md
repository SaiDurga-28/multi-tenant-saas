# API Documentation

Base URL (Docker):
http://localhost:5000/api

All responses follow this format:
```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```
Note:
- `data` may be an object, array, or null depending on the endpoint.
- Error responses return `success: false` with an error message.

## Authentication:

JWT-based authentication is used.
Send token in request header:
```http
Authorization: Bearer <JWT_TOKEN>
```

## 1. Authentication APIs
### 1.1 Login
**POST** /api/auth/login

Request Body:
```json
{
  "email": "admin@demo.com",
  "password": "Demo@123",
  "tenantSubdomain": "demo"
}
```
Success Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token"
}
```
## 2. Tenant APIs
### 2.1 Get Tenant Details
**GET** /api/tenants/:tenantId

Auth: Required
Role: Tenant Admin / Super Admin

### 2.2 List All Tenants
**GET** /api/tenants

Auth: Required
Role: Super Admin only

## 3. User Management APIs
### 3.1 Create User
**POST** /api/tenants/:tenantId/users

Auth: Required
Role: Tenant Admin

Request Body:
```json
{
  "email": "user1@demo.com",
  "password": "User@123",
  "fullName": "Demo User",
  "role": "user"
}
```
### 3.2 List Users
**GET** /api/tenants/:tenantId/users

Auth: Required
Role: Tenant Admin / User

### 3.3 Update User
**PUT** /api/users/:userId

Auth: Required
Role: Tenant Admin

### 3.4 Delete User
**DELETE** /api/users/:userId

Auth: Required
Role: Tenant Admin

## 4. Project APIs
### 4.1 Create Project
**POST** /api/projects

Auth: Required

Request Body:
```json
{
  "name": "Demo Project",
  "description": "Initial demo project"
}
```
Success Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Demo Project",
    "status": "active"
  }
}
```
### 4.2 List Projects
**GET** /api/projects

Auth: Required

### 4.3 Update Project
**PUT** /api/projects/:projectId

Auth: Required
Role: Tenant Admin / Creator

### 4.4 Delete Project
**DELETE** /api/projects/:projectId

Auth: Required
Role: Tenant Admin / Creator

## 5. Task APIs
### 5.1 Create Task
**POST** /api/projects/:projectId/tasks

Auth: Required

Request Body:
```json
{
  "title": "Initial Task",
  "description": "First demo task",
  "priority": "medium"
}
```
### 5.2 List Tasks
**GET** /api/projects/:projectId/tasks

Auth: Required

### 5.3 Update Task
**PUT** /api/tasks/:taskId

Auth: Required

### 5.4 Update Task Status
**PATCH** /api/tasks/:taskId/status

Auth: Required

Request Body:
```json
{
  "status": "completed"
}
```
## 6. Health Check
Health Endpoint
**GET** /api/health

Response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "ISO-date"
}
```
End of API Documentation