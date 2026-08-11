# Backend-Frontend Alignment Guide

## Overview
This document ensures the backend (Nexus) and frontend (React Vite Tailwind) remain perfectly aligned. It serves as the single source of truth for API contracts, data models, and integration points.

---

## 1. API Contract Alignment

### Base URL
| Environment | Backend | Frontend |
|-------------|---------|----------|
| Development | `http://localhost:3000/api/v1` | `/api/v1` (proxied via Vite) |
| Production | `https://api.example.com/api/v1` | `/api/v1` |

### Vite Proxy Configuration (Development)
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### Endpoint Mapping Table

| Feature | Frontend Constant | Backend Route | Method | Auth |
|---------|-------------------|---------------|--------|------|
| **Auth** | | | | |
| Register | `REGISTER = "/auth/register"` | `POST /api/v1/auth/register` | POST | Public |
| Login | `LOGIN = "/auth/login"` | `POST /api/v1/auth/login` | POST | Public |
| Logout | `LOGOUT = "/auth/logout"` | `POST /api/v1/auth/logout` | POST | Required |
| Refresh | *(handled by adapter)* | `POST /api/v1/auth/refresh` | POST | Public |
| Session | `SESSION = "/auth/session"` | `GET /api/v1/auth/session` | GET | Required |
| Current User | `CURRENT_USER = "/auth/me"` | `GET /api/v1/auth/me` | GET | Required |
| Switch User | `SWITCH_USER = "/auth/switch"` | `POST /api/v1/auth/switch` | POST | Required |
| Super Admin Pwd | `SUPER_ADMIN_PASSWORD = "/auth/super-admin-password"` | `GET /api/v1/auth/super-admin-password` | GET | Required |
| **Users** | | | | |
| List | `USERS = "/users"` | `GET /api/v1/users` | GET | Required |
| Create | `USERS = "/users"` | `POST /api/v1/users` | POST | Required |
| Get One | `USER_DETAILS(id)` | `GET /api/v1/users/:id` | GET | Required |
| Update | `USER_DETAILS(id)` | `PUT /api/v1/users/:id` | PUT | Required |
| Partial Update | `USER_DETAILS(id)` | `PATCH /api/v1/users/:id` | PATCH | Required |
| Delete | `USER_DETAILS(id)` | `DELETE /api/v1/users/:id` | DELETE | Required |
| Reset Password | *(custom)* | `POST /api/v1/users/:id/reset-password` | POST | Required |
| **Roles** | | | | |
| List | `ROLES = "/roles"` | `GET /api/v1/roles` | GET | Required |
| Create | `ROLES = "/roles"` | `POST /api/v1/roles` | POST | Required |
| Get One | `ROLE_DETAILS(id)` | `GET /api/v1/roles/:id` | GET | Required |
| Update | `ROLE_DETAILS(id)` | `PUT /api/v1/roles/:id` | PUT | Required |
| Partial Update | `ROLE_DETAILS(id)` | `PATCH /api/v1/roles/:id` | PATCH | Required |
| Delete | `ROLE_DETAILS(id)` | `DELETE /api/v1/roles/:id` | DELETE | Required |
| **Permissions** | | | | |
| List | `PERMISSIONS = "/permissions"` | `GET /api/v1/permissions` | GET | Required |
| Get One | `PERMISSION_DETAILS(id)` | `GET /api/v1/permissions/:id` | GET | Required |
| Create | `PERMISSIONS = "/permissions"` | `POST /api/v1/permissions` | POST | Required |
| Update | `PERMISSION_DETAILS(id)` | `PUT /api/v1/permissions/:id` | PUT | Required |
| Partial Update | `PERMISSION_DETAILS(id)` | `PATCH /api/v1/permissions/:id` | PATCH | Required |
| Delete | `PERMISSION_DETAILS(id)` | `DELETE /api/v1/permissions/:id` | DELETE | Required |
| **Navigation** | | | | |
| Get Tree | `NAVIGATION = "/navigation"` | `GET /api/v1/navigation` | GET | Required |
| **Health** | | | | |
| Check | *(direct)* | `GET /api/v1/health` | GET | Public |

---

## 2. Data Model Alignment

### User Model

| Field | Backend (IUser) | Frontend (User) | Notes |
|-------|-----------------|-----------------|-------|
| ID | `userId: string` | `id: string` + `userId?: string` | Frontend uses `id` for React keys |
| Username | `username: string` | `username: string` | Unique |
| First Name | `firstName: string` | `firstName: string` | |
| Last Name | `lastName: string` | `lastName: string` | |
| Full Name | *(computed)* | `name: string` | Frontend: `firstName + " " + lastName` |
| Email | `email: string` | `email: string` | Unique |
| Phone | `phone: string` | `phone: string` | |
| Avatar | *(none)* | `avatar?: string` | Frontend only (UI) |
| Role ID | `roleId: string` | `roleId: string` | Reference to Role |
| Role Name | `role: string` | `role: string` | Denormalized for display |
| Status | `status: string` | `status: Status` | `active \| inactive \| blocked \| pending` |
| Location | `location: string` | `location: string` | |
| Address | `address: string` | `address: string` | |
| Bio | `bio: string` | `bio?: string` | |
| Job Title | *(none)* | `jobTitle?: string` | Frontend only |
| Last Active | `lastActive: Date \| null` | `lastActive: string` | ISO string |
| Approved At | `approvedAt: Date \| null` | `approvedAt?: string` | ISO string |
| Approved By | `approvedBy: string \| null` | `approvedBy?: string` | User ID |
| Approved By Name | `approvedByName?: string \| null` | `approvedByName?: string` | Denormalized |
| Is Protected | `isProtected: boolean` | `isProtected?: boolean` | Prevents deletion |
| Password | `password: string` (hashed) | `password?: string` | Mock only, never sent to real API |
| Permission Overrides | *(none)* | `permissionIds?: string[]` | Frontend only |
| Created At | `createdAt: Date` | `createdAt: string` | ISO string |
| Updated At | `updatedAt: Date` | `updatedAt: string` | ISO string |

### Role Model

| Field | Backend (IRole) | Frontend (Role) | Notes |
|-------|-----------------|-----------------|-------|
| ID | `roleId: string` | `id: string` | Frontend uses `id` |
| Name | `name: string` | `name: string` | Unique |
| Description | `description: string` | `description: string` | |
| Permission IDs | `permissionIds: string[]` | `permissionIds: string[]` | Array of permission IDs |
| Color | `color: string` | `color: string` | Tailwind gradient (e.g., `from-blue-500 to-blue-600`) |
| Is System | `isSystem: boolean` | `isSystem?: boolean` | Non-deletable |
| Is Super Admin | `isSuperAdmin: boolean` | *(none)* | Backend only |
| Created By | `createdBy: string` | `createdBy?: string` | User ID |
| Created At | `createdAt: Date` | `createdAt: string` | ISO string |
| Updated At | `updatedAt: Date` | *(none)* | Backend only |
| Is Default | *(none)* | `isDefault?: boolean` | Frontend only (viewer role) |

### Permission Model

| Field | Backend (IPermission) | Frontend (Permission) | Notes |
|-------|----------------------|----------------------|-------|
| ID | `permissionId: string` | `id: string` | Frontend uses `id` |
| Legacy ID | `id: string` | *(none)* | Backward compat |
| Name | `name: string` | `name: string` | Display name |
| Key | `key: string` | `key: string` | Unique key (e.g., `users.create`) |
| Module | `module: string` | `module: string` | Grouping (e.g., `users`) |
| Description | `description: string` | `description: string` | |
| Assigned Roles Count | `assignedRolesCount: number` | `assignedRolesCount?: number` | For delete protection |

### Navigation Model

| Field | Backend (NavigationItem) | Frontend (NavigationItem) | Notes |
|-------|-------------------------|--------------------------|-------|
| ID | `id: string` | `id: string` | |
| Title | `title: string` | `title: string` | |
| Icon | `icon?: string` | `icon?: string` | Lucide icon name |
| Route | `route?: string` | `route?: RouteName` | Frontend uses typed RouteName |
| Permission | `permission?: string` | `permission?: string` | Permission key for visibility |
| Order | `order: number` | `order: number` | Sort order |
| Visible | `visible: boolean` | `visible: boolean` | |
| Children | `children?: NavigationItem[]` | `children?: NavigationItem[]` | Recursive |

---

## 3. Response Format Alignment

### Standard API Response (Both Sides)

```typescript
// Backend returns / Frontend expects
interface ApiResponse<T> {
  success: boolean;
  status: number;           // HTTP status code
  message: string;          // Human-readable message
  data: T | null;           // Response payload
  meta: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
    stats?: UserStats;      // For user list
  };
  errors: ApiError[] | null;
}

interface ApiError {
  code: string;             // Error code (e.g., "VALIDATION_ERROR")
  message: string;          // Human-readable
  field?: string;           // Field name for validation errors
}
```

### Pagination Request Parameters

```typescript
// Frontend sends / Backend validates (Zod)
interface UserQueryParams {
  search?: string;          // Search across name, email, username
  roleId?: string;          // Filter by role
  status?: string;          // Filter by status
  page?: number;            // Page number (1-based)
  limit?: number;           // Items per page
  sort?: string;            // Sort field
  order?: "asc" | "desc";   // Sort direction
}
```

---

## 4. Authentication Alignment

### Token Flow

```
┌─────────────┐     POST /auth/login      ┌─────────────┐
│  Frontend   │ ─────────────────────────▶ │  Backend    │
│             │ ◀───────────────────────── │             │
│             │  { accessToken, user }     │  Sets       │
│             │  Set-Cookie: refreshToken  │  HttpOnly   │
└─────────────┘                            │  Cookie     │
       │                                   └─────────────┘
       │                                            │
       │  GET /auth/me (Authorization: Bearer)      │
       ├───────────────────────────────────────────▶│
       │ ◀──────────────────────────────────────────┤
       │  { user }                                  │
       │                                            │
       │  POST /auth/refresh (Cookie)               │
       ├───────────────────────────────────────────▶│
       │ ◀──────────────────────────────────────────┤
       │  { accessToken } + New Refresh Cookie      │
       │                                            │
       │  POST /auth/logout (Cookie)                │
       ├───────────────────────────────────────────▶│
       │ ◀──────────────────────────────────────────┤
       │  Clear Cookie                              │
```

### Token Storage
| Token | Backend | Frontend |
|-------|---------|----------|
| Access Token | JWT in response body | In-memory (Zustand store) |
| Refresh Token | HttpOnly Secure Cookie | Managed by browser (auto-sent) |

### Auth Middleware (Backend)
```typescript
// Attaches to req.user
interface AuthUser {
  userId: string;
  roleId: string;
  permissions: string[];  // Resolved from role
}
```

### Auth Store (Frontend)
```typescript
interface AuthState {
  user: User | null;
  session: AuthSession | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

---

## 5. Permission System Alignment

### Permission Key Format
**Standard**: `{module}.{action}`

| Module | Actions | Example Keys |
|--------|---------|--------------|
| users | view, create, edit, delete, reset_password | `users.view`, `users.create` |
| roles | view, create, edit, delete, assign | `roles.view`, `roles.assign` |
| permissions | view, create, edit, delete | `permissions.view` |
| navigation | view, edit | `navigation.view` |
| pages | dashboard, users, roles, permissions, assignment, logs, settings | `pages.users` |

### Permission Assignment Flow
1. **Backend**: Permissions stored in Permission collection with unique `key`
2. **Backend**: Roles contain `permissionIds` array referencing permissions
3. **Backend**: On login, resolve user's permissions via role → return in token
4. **Frontend**: Store permissions in auth store
5. **Frontend**: `PermissionGuard` checks `hasPermission(requiredKey)`
6. **Frontend**: Navigation filters items by `item.permission`

### Frontend Permission Constants (`lib/permissions.ts`)
```typescript
export const PERMISSIONS = {
  // Users
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_EDIT: "users.edit",
  USERS_DELETE: "users.delete",
  USERS_RESET_PASSWORD: "users.reset_password",
  
  // Roles
  ROLES_VIEW: "roles.view",
  ROLES_CREATE: "roles.create",
  ROLES_EDIT: "roles.edit",
  ROLES_DELETE: "roles.delete",
  ROLES_ASSIGN: "roles.assign",
  
  // Permissions
  PERMISSIONS_VIEW: "permissions.view",
  PERMISSIONS_CREATE: "permissions.create",
  PERMISSIONS_EDIT: "permissions.edit",
  PERMISSIONS_DELETE: "permissions.delete",
  
  // Navigation
  NAVIGATION_VIEW: "navigation.view",
  NAVIGATION_EDIT: "navigation.edit",
  
  // Pages (Route Guards)
  PAGES_DASHBOARD: "pages.dashboard",
  PAGES_USERS: "pages.users",
  PAGES_ROLES: "pages.roles",
  PAGES_PERMISSIONS: "pages.permissions",
  PAGES_ASSIGNMENT: "pages.assignment",
  PAGES_LOGS: "pages.logs",
  PAGES_SETTINGS: "pages.settings",
} as const;
```

### Backend Permission Seeding
Permissions are seeded from `modules/permissions/registry/permissions.registry.ts` - must match frontend constants exactly.

---

## 6. Navigation Alignment

### Backend Navigation Document
Single document in `navigation` collection:
```typescript
{
  items: NavigationItem[]  // Hierarchical menu tree
}
```

### Frontend Consumption
1. `NavigationApi.getNavigation()` → `GET /api/v1/navigation`
2. `NavigationService` transforms for sidebar
3. `NavigationStore` caches tree
4. Sidebar component filters by `userPermissions.includes(item.permission)`
5. Recursive rendering for nested children

### Navigation Item Permission Field
- Backend: `permission?: string` (e.g., `"pages.users"`)
- Frontend: Checks `hasPermission(item.permission)` before rendering
- If no permission field → always visible

---

## 7. Validation Alignment

### User Validation

| Field | Backend (Zod) | Frontend (React Hook Form + Zod) |
|-------|---------------|----------------------------------|
| firstName | `min(1).max(50)` | Required, max 50 |
| lastName | `min(1).max(50)` | Required, max 50 |
| email | `email()` | Valid email format |
| phone | `optional().max(20)` | Optional, max 20 |
| roleId | `string().min(1)` | Required select |
| status | `enum(Status)` | Required select |
| password | `min(8).max(100)` | Min 8 chars (create only) |
| username | `optional().alphanum()` | Optional, alphanumeric |

### Role Validation

| Field | Backend (Zod) | Frontend |
|-------|---------------|----------|
| name | `min(1).max(50).unique()` | Required, unique check |
| description | `optional().max(500)` | Optional |
| permissionIds | `array(string())` | Multi-select |
| color | `regex(gradient)` | Color picker |

### Permission Validation

| Field | Backend (Zod) | Frontend |
|-------|---------------|----------|
| name | `min(1).max(100)` | Required |
| key | `regex(/^[a-z]+\.[a-z_]+$/).unique()` | Required, format: `module.action` |
| module | `min(1).max(50)` | Required, select from list |
| description | `optional().max(500)` | Optional |

---

## 8. Error Handling Alignment

### Backend Error Responses

| Scenario | Status | Error Code | Message |
|----------|--------|------------|---------|
| Validation failed | 422 | `VALIDATION_ERROR` | "Validation failed" |
| Unauthorized | 401 | `UNAUTHORIZED` | "Authentication required" |
| Forbidden | 403 | `FORBIDDEN` | "Insufficient permissions" |
| Not found | 404 | `NOT_FOUND` | "Resource not found" |
| Conflict (duplicate) | 409 | `CONFLICT` | "Resource already exists" |
| Server error | 500 | `INTERNAL_ERROR` | "Internal server error" |

### Frontend Error Handling
```typescript
// In apiAdapter.ts
try {
  const response = await apiClient.request(...);
  if (!response.success) {
    throw new ApiError(response.errors?.[0]?.message || response.message);
  }
  return response;
} catch (error) {
  // Normalize to ApiError format
  throw normalizeError(error);
}
```

---

## 9. Seeding Alignment

### Startup Seeding Order (Backend)
1. **Permissions** → From registry (must match frontend `PERMISSIONS` constants)
2. **Roles** → Default roles with permission assignments
3. **Super Admin User** → With Super Admin role

### Default Roles & Permissions

| Role | Permissions | Color | System |
|------|-------------|-------|--------|
| Super Admin | All permissions | `from-red-500 to-red-600` | Yes |
| Admin | Most permissions (no system config) | `from-blue-500 to-blue-600` | Yes |
| User | Basic permissions (view own, limited create) | `from-green-500 to-green-600` | Yes |
| Viewer | Read-only permissions | `from-slate-500 to-slate-600` | Yes |

---

## 10. Development Workflow Alignment

### Running Both Services

```bash
# Terminal 1 - Backend
cd backend
npm run dev        # http://localhost:3000

# Terminal 2 - Frontend
cd frontend
npm run dev        # http://localhost:5173 (proxies /api to :3000)
```

### Type Sharing Strategy
Currently: **Manual alignment** - Types defined in both codebases
Future: **Shared package** - Extract types to `@nexus/types` npm package

### API Testing Checklist

- [ ] All endpoints return `ApiResponse<T>` format
- [ ] Pagination meta matches `Pagination` interface
- [ ] Error responses match `ApiError[]` format
- [ ] Date fields are ISO 8601 strings
- [ ] Permission keys match exactly between frontend constants and backend registry
- [ ] Navigation items have correct `permission` fields
- [ ] User status values match `Status` type
- [ ] Role color values are valid Tailwind gradients

---

## 11. Deployment Alignment

### Environment Variables

| Variable | Backend | Frontend |
|----------|---------|----------|
| API URL | `PORT`, `MONGODB_URI` | `VITE_API_URL` (build time) |
| JWT | `JWT_SECRET`, `JWT_REFRESH_SECRET` | N/A (HttpOnly cookie) |
| CORS | `CORS_ORIGIN` | N/A |
| Node Env | `NODE_ENV` | `NODE_ENV` |

### Build Outputs
- Backend: `dist/` (compiled JS)
- Frontend: `dist/` (Vite build, single file via `vite-plugin-singlefile`)

### Docker (Future)
```dockerfile
# Multi-stage build
# Stage 1: Build frontend
# Stage 2: Build backend
# Stage 3: Runtime with both
```

---

## 12. Version Compatibility Matrix

| Backend Version | Frontend Version | Notes |
|-----------------|------------------|-------|
| 1.0.x | 0.0.x | Initial alignment |
| 1.1.x | 0.1.x | Added navigation module |
| 1.2.x | 0.2.x | Added permission registry |

**Rule**: Major version bump on breaking API changes. Minor for additive changes.

---

## 13. Quick Reference: File Locations

### Backend Key Files
```
/backend/src/
├── modules/
│   ├── auth/routes/auth.route.ts          # Auth endpoints
│   ├── users/routes/user.route.ts         # User endpoints
│   ├── roles/routes/role.route.ts         # Role endpoints
│   ├── permissions/routes/permission.route.ts
│   └── navigation/routes/navigation.route.ts
├── modules/permissions/registry/permissions.registry.ts  # Permission definitions
└── config/env.ts                          # Environment validation
```

### Frontend Key Files
```
/frontend/src/
├── modules/
│   ├── auth/api/auth.endpoints.ts         # Auth URL constants
│   ├── users/api/user.endpoints.ts        # User URL constants
│   ├── roles/api/role.endpoints.ts        # Role URL constants
│   ├── permissions/api/permission.endpoints.ts
│   └── navigation/api/navigation.endpoints.ts
├── lib/permissions.ts                     # Permission constants (MUST MATCH BACKEND)
├── lib/types.ts                           # Shared domain types
├── core/api/types.ts                      # ApiResponse, ApiError, Pagination
└── router/routes.tsx                      # Route configuration
```

---

## 14. Change Management Protocol

When making changes that affect alignment:

### Backend Changes Requiring Frontend Updates
1. Add/modify endpoint → Update corresponding `*.endpoints.ts`
2. Change response format → Update `ApiResponse` usage
3. Add/remove permission key → Update `lib/permissions.ts` AND registry
4. Change user/role/permission model → Update `lib/types.ts`
5. Modify validation rules → Update frontend validation schemas
6. Change navigation structure → Update NavigationItem type

### Frontend Changes Requiring Backend Updates
1. New feature needing API → Implement backend endpoints first
2. New permission needed → Add to backend registry first
3. New navigation item → Add to backend navigation seed

### Checklist for PRs
- [ ] Backend tests pass
- [ ] Frontend builds without TypeScript errors
- [ ] All endpoint constants match
- [ ] Permission keys synchronized
- [ ] Types aligned
- [ ] Integration tested locally

---

## 15. Implemented Features Summary

### ✅ Fully Aligned & Working

| Feature | Backend | Frontend | Integration |
|---------|---------|----------|-------------|
| Authentication | ✅ | ✅ | ✅ |
| User CRUD | ✅ | ✅ | ✅ |
| Role CRUD | ✅ | ✅ | ✅ |
| Permission CRUD | ✅ | ✅ | ✅ |
| Navigation | ✅ | ✅ | ✅ |
| Permission Guards | N/A | ✅ | ✅ (via token) |
| Pagination/Filtering | ✅ | ✅ | ✅ |
| Seeding | ✅ | N/A | ✅ |

### 🔄 In Progress / Partial
- Session management (backend module exists, frontend not connected)
- Activity logs (frontend page exists, backend not implemented)
- Settings (frontend page exists, backend not implemented)

### 📋 Planned
- Email verification
- Password reset flow
- 2FA
- Audit logging
- File upload
- Real-time notifications

---

*Last Updated: 2026-08-11*
*This document should be updated whenever API contracts, data models, or integration points change.*