# Routes

## Purpose

This folder is the central route registry for the application.

It connects all feature/module routes to the Express application.

The `routes` folder does not contain business logic.

Its only responsibility is to organize and register module routes.

---

## Current Folder Structure

```text
routes/
│
├── index.ts
└── README.md
```

---

## Files Responsibility

### index.ts

Registers all application modules.

This file acts as the central router for the backend.

Current Registered Routes

| Route Prefix | Module |
|--------------|--------|
| `/auth` | Authentication Module |
| `/health` | Health Check Module |

---

## Request Flow

```text
Client Request
      │
      ▼
app.ts
      │
      ▼
/api/v1
      │
      ▼
routes/index.ts
      │
      ├── /auth
      │        │
      │        ▼
      │   modules/auth/routes
      │
      └── /health
               │
               ▼
        modules/health/routes
```

---

## Current API Endpoints

### Health Module

```http
GET /api/v1/health
```

Response

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

### Auth Module

```http
GET /api/v1/auth
```

Response

```json
{
  "success": true,
  "message": "Auth Module is running"
}
```

---

## Rules

- Do not write business logic inside routes.
- Routes should only register endpoints.
- Controllers handle request processing.
- Services contain business logic.
- Every new feature should register its routes here.
- Use one router per module.