# Frontend Architecture & API Documentation

## Project Overview
**React Vite Tailwind** - Modern React 19 frontend with TypeScript, Vite, Tailwind CSS 4, and Zustand for state management.

## Tech Stack
- **Framework**: React 19.2.6
- **Build Tool**: Vite 7.x
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 4.x + clsx + tailwind-merge
- **Routing**: React Router DOM 7.x
- **State Management**: Zustand 5.x
- **HTTP Client**: Axios 1.x (via custom ApiClient wrapper)
- **Icons**: Lucide React
- **Linting**: ESLint 9 + TypeScript ESLint

## Project Structure
```
frontend/
├── src/
│   ├── main.tsx                 # App entry point
│   ├── App.tsx                  # Root component (minimal)
│   ├── index.css                # Global styles + Tailwind imports
│   ├── vite-env.d.ts            # Vite type declarations
│   │
│   ├── api/                     # Legacy API barrel (backward compat)
│   │   ├── endpoints.ts         # Re-exports all feature endpoints
│   │   └── index.ts             # Re-exports core API + mockClient
│   │
│   ├── core/                    # Generic infrastructure (shared)
│   │   ├── api/                 # Core HTTP client + types
│   │   │   ├── client.ts        # ApiClient class (GET, POST, PUT, PATCH, DELETE)
│   │   │   ├── types.ts         # ApiResponse, Pagination, ApiError, etc.
│   │   │   ├── response.ts      # Response helpers
│   │   │   ├── apiAdapter.ts    # Adapter pattern for mock/real backend
│   │   │   └── index.ts         # Core API barrel
│   │   ├── auth/                # Auth infrastructure (empty - feature-owned)
│   │   ├── authorization/       # Permission utilities
│   │   ├── config/              # App configuration
│   │   └── mock/                # Mock backend implementation
│   │
│   ├── lib/                     # Shared utilities & types
│   │   ├── helpers.ts           # Utility functions
│   │   ├── permissions.ts       # Permission constants & helpers
│   │   └── types.ts             # Shared domain types (User, Role, Permission, etc.)
│   │
│   ├── mocks/                   # Mock data for development
│   │   ├── auth.ts
│   │   ├── logs.ts
│   │   ├── navigation.ts
│   │   ├── permissions.ts
│   │   ├── roles.ts
│   │   └── users.ts
│   │
│   ├── modules/                 # Feature modules (domain-driven)
│   │   ├── auth/                # Authentication feature
│   │   │   ├── api/             # Auth API (endpoints + client)
│   │   │   ├── components/      # Auth UI components
│   │   │   ├── hooks/           # Auth React hooks
│   │   │   ├── pages/           # LoginPage, RegisterPage
│   │   │   ├── routes.tsx       # Auth route definitions
│   │   │   ├── services/        # AuthService (business logic)
│   │   │   ├── store/           # Auth Zustand store
│   │   │   ├── types/           # Auth-specific types
│   │   │   └── utils/           # Auth utilities
│   │   │
│   │   ├── dashboard/           # Dashboard feature
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── routes.tsx
│   │   │
│   │   ├── users/               # User management feature
│   │   │   ├── api/             # User API
│   │   │   ├── components/      # UserList, UserDetails, UserForm
│   │   │   ├── hooks/
│   │   │   ├── pages/           # UserList page
│   │   │   ├── routes.tsx       # User routes with PermissionGuard
│   │   │   ├── services/
│   │   │   ├── shared/
│   │   │   ├── store/
│   │   │   ├── types.ts
│   │   │   └── utils/
│   │   │
│   │   ├── roles/               # Role management feature
│   │   │   ├── api/
│   │   │   ├── components/      # RoleAssignment
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── routes.tsx
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   ├── permissions/         # Permission management feature
│   │   │   ├── api/
│   │   │   ├── components/      # Permissions table
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── routes.tsx
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   ├── navigation/          # Navigation feature
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── store/
│   │   │
│   │   ├── logs/                # Activity logs feature
│   │   │   └── routes.tsx
│   │   │
│   │   ├── settings/            # Settings feature
│   │   │   └── routes.tsx
│   │   │
│   │   ├── system/              # System feature (logs, settings)
│   │   │   └── api/
│   │   │
│   │   ├── dashboard.routes.tsx # Dashboard route definitions
│   │   ├── logs.routes.tsx
│   │   ├── overview.routes.tsx
│   │   └── settings.routes.tsx
│   │
│   ├── pages/                   # Legacy page components (being migrated)
│   │   ├── ActivityLogs.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Dashboard copy.tsx
│   │   ├── Overview.tsx
│   │   ├── Overview copy.tsx
│   │   └── Settings.tsx
│   │
│   ├── router/                  # Routing infrastructure
│   │   ├── index.tsx            # Router exports
│   │   ├── routes.tsx           # Main router configuration
│   │   ├── guards/              # Route guards
│   │   │   └── ProtectedRoute.tsx
│   │   └── pages/               # Error pages
│   │       ├── NotFound.tsx
│   │       └── Forbidden.tsx
│   │
│   ├── routes/                  # Legacy routes barrel
│   │   ├── index.ts
│   │   └── README.md
│   │
│   ├── services/                # Legacy services (being migrated to modules)
│   │   ├── auth.service.ts
│   │   ├── navigation.service.ts
│   │   └── system.service.ts
│   │
│   ├── shared/                  # Shared UI components & utilities
│   │   ├── components/          # Reusable UI components
│   │   ├── constants/
│   │   ├── hooks/               # Shared React hooks
│   │   ├── layouts/             # AdminLayout, etc.
│   │   ├── providers/           # Context providers
│   │   │   ├── AppProviders.tsx # Root providers wrapper
│   │   │   └── AuthBootstrap.tsx # Auth initialization
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── store/                   # Global Zustand stores (legacy)
│   │   ├── constants.ts
│   │   ├── index.ts
│   │   ├── context/
│   │   ├── hooks/
│   │   └── providers/
│   │
│   └── utils/                   # Utility functions
│       └── cn.ts                # clsx + tailwind-merge helper
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

## Routing Architecture

### Route Tree
```
/                                    → AppRoot (AppProviders only)
├─ login                             → LoginPage (public)
├─ register                          → RegisterPage (public)
└─ ""                                → ProtectedRoute (auth gate)
     └─ ""                           → AdminLayout shell
          ├─ index                   → /dashboard (redirect)
          ├─ dashboard               → Dashboard feature
          ├─ users/**                → Users feature (PermissionGuard: pages.users)
          ├─ roles/assignment        → Roles feature (PermissionGuard: pages.assignment)
          ├─ permissions             → Permissions feature (PermissionGuard: pages.permissions)
          ├─ logs                    → Logs feature
          ├─ settings                → Settings feature
          └─ *                       → NotFound
/403                                 → Forbidden (public)
/404                                 → NotFound (public)
```

### Route Guards
- **ProtectedRoute**: Checks authentication, redirects to `/login` if unauthenticated
- **PermissionGuard**: Checks specific permission, shows Forbidden if not authorized

### Feature Route Pattern
Each feature module owns its routes in `modules/<feature>/routes.tsx`:
```typescript
export const featureRoutes: RouteObject[] = [
  {
    path: "feature",
    element: <PermissionGuard permission="pages.feature" />,
    children: [
      { index: true, element: <FeatureList /> },
      { path: "new", element: <FeatureForm /> },
      { path: ":id/edit", element: <FeatureForm /> },
      { path: ":id", element: <FeatureDetails /> },
    ],
  },
];
```

## API Layer Architecture

### Core API (`@/core/api`)
- **ApiClient**: Generic HTTP client with GET, POST, PUT, PATCH, DELETE
- **ApiResponse<T>**: Standardized response wrapper matching backend
- **ApiError**: Error structure
- **Pagination**: Standard pagination metadata
- **RequestConfig**: Request options (headers, params, timeout, signal)

### Feature API Pattern
Each feature module has its own API layer:
```
modules/<feature>/api/
├── <feature>.endpoints.ts    # URL constants only
├── <feature>.api.ts          # ApiClient wrapper with typed methods
└── index.ts                  # Barrel export
```

### Endpoint Definitions (Frontend ↔ Backend Alignment)

| Feature | Frontend Endpoint | Backend Route |
|---------|-------------------|---------------|
| Auth | `REGISTER = "/auth/register"` | `POST /api/v1/auth/register` |
| Auth | `LOGIN = "/auth/login"` | `POST /api/v1/auth/login` |
| Auth | `LOGOUT = "/auth/logout"` | `POST /api/v1/auth/logout` |
| Auth | `SESSION = "/auth/session"` | `GET /api/v1/auth/session` |
| Auth | `CURRENT_USER = "/auth/me"` | `GET /api/v1/auth/me` |
| Auth | `SWITCH_USER = "/auth/switch"` | `POST /api/v1/auth/switch` |
| Auth | `SUPER_ADMIN_PASSWORD = "/auth/super-admin-password"` | `GET /api/v1/auth/super-admin-password` |
| Users | `USERS = "/users"` | `GET/POST /api/v1/users` |
| Users | `USER_DETAILS(id) = \`/users/${id}\`` | `GET/PUT/PATCH/DELETE /api/v1/users/:id` |
| Roles | `ROLES = "/roles"` | `GET/POST /api/v1/roles` |
| Roles | `ROLE_DETAILS(id) = \`/roles/${id}\`` | `GET/PUT/PATCH/DELETE /api/v1/roles/:id` |
| Permissions | `PERMISSIONS = "/permissions"` | `GET/POST /api/v1/permissions` |
| Permissions | `PERMISSION_DETAILS(id) = \`/permissions/${id}\`` | `GET/PUT/PATCH/DELETE /api/v1/permissions/:id` |
| Navigation | `NAVIGATION = "/navigation"` | `GET /api/v1/navigation` |

### API Client Usage
```typescript
// In feature API (e.g., modules/users/api/user.api.ts)
import { api } from "@/core/api";
import { USERS, USER_DETAILS } from "./user.endpoints";

export const UserApi = {
  list: (params?: UserQueryParams) => api.get<User[]>(USERS, { params }),
  get: (id: string) => api.get<User>(USER_DETAILS(id)),
  create: (data: CreateUserInput) => api.post<User>(USERS, data),
  update: (id: string, data: UpdateUserInput) => api.put<User>(USER_DETAILS(id), data),
  delete: (id: string) => api.delete<void>(USER_DETAILS(id)),
};
```

## State Management

### Zustand Stores (Feature-Level)
Each feature manages its own state:
- `modules/auth/store/` - Auth state (user, session, tokens)
- `modules/users/store/` - User list, filters, selected user
- `modules/roles/store/` - Role list, assignments
- `modules/permissions/store/` - Permission list
- `modules/navigation/store/` - Navigation tree

### Global Stores (Legacy - being migrated)
- `store/` - Root store with providers

## Shared Types (`@/lib/types.ts`)

### Core Domain Types
```typescript
type Status = "active" | "inactive" | "blocked" | "pending";

interface Permission {
  id: string;
  name: string;
  key: string;           // e.g., "users.create"
  module: string;        // e.g., "users"
  description: string;
  assignedRolesCount?: number;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;         // Tailwind gradient
  permissionIds: string[];
  createdAt: string;
  isSystem?: boolean;
  createdBy?: string;
  isDefault?: boolean;
}

interface User {
  id: string;
  username: string;
  userId?: string;
  firstName: string;
  lastName: string;
  name: string;          // Computed: firstName + lastName
  email: string;
  phone: string;
  avatar?: string;
  roleId: string;
  role: string;          // Role name (denormalized)
  status: Status;
  location: string;
  address: string;
  lastActive: string;
  approvedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  createdAt: string;
  updatedAt: string;
  bio?: string;
  jobTitle?: string;
  password?: string;     // Mock only
  permissionIds?: string[];
  isProtected?: boolean;
}

interface NavigationItem {
  id: string;
  title: string;
  icon?: string;
  route?: RouteName;
  permission?: string;   // Required permission key
  order: number;
  visible: boolean;
  children?: NavigationItem[];
}

type RouteName = 
  | "dashboard"
  | "users"
  | "userDetails"
  | "userForm"
  | "permissions"
  | "assignment"
  | "logs"
  | "settings";
```

## Permission System

### Permission Keys (Must Match Backend)
Defined in `lib/permissions.ts`:
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
  
  // Pages (for route guards)
  PAGES_DASHBOARD: "pages.dashboard",
  PAGES_USERS: "pages.users",
  PAGES_ROLES: "pages.roles",
  PAGES_PERMISSIONS: "pages.permissions",
  PAGES_ASSIGNMENT: "pages.assignment",
  PAGES_LOGS: "pages.logs",
  PAGES_SETTINGS: "pages.settings",
} as const;
```

### PermissionGuard Component
```tsx
<PermissionGuard permission="pages.users">
  <UserList />
</PermissionGuard>
```
- Checks if current user has the required permission
- Shows Forbidden page if not authorized
- Integrates with auth store for user permissions

## Authentication Flow

### Login Flow
1. User submits credentials → `AuthService.login()`
2. Calls `AuthApi.login()` → `POST /api/v1/auth/login`
3. Backend returns access token + sets refresh token cookie
4. Frontend stores access token in memory (Zustand)
5. Redirects to `/dashboard`

### Token Refresh
- Automatic via `apiAdapter` on 401 response
- Calls `POST /api/v1/auth/refresh`
- Rotates both access and refresh tokens

### Logout Flow
1. `AuthService.logout()` → `AuthApi.logout()` → `POST /api/v1/auth/logout`
2. Backend clears refresh token cookie
3. Frontend clears auth state
4. Redirects to `/login`

### Session Persistence
- Access token: In-memory (Zustand store)
- Refresh token: HttpOnly cookie (managed by backend)
- On app load: `AuthBootstrap` calls `/auth/me` to restore session

## UI Components & Layout

### AdminLayout
- Sidebar navigation (from NavigationService)
- Top header with user menu
- Main content area with Outlet
- Responsive (mobile drawer)

### Shared UI Components (`shared/components/`)
- Button, Input, Select, Modal, Table, Card, Badge, Avatar, etc.
- Built with Tailwind CSS + clsx + tailwind-merge

### Permission-Gated Navigation
- Navigation items have optional `permission` field
- Sidebar filters items based on user permissions
- Uses `hasPermission()` hook from auth store

## Development Commands
```bash
npm run dev        # Start Vite dev server
npm run build      # Production build (Vite + TypeScript)
npm run preview    # Preview production build
npm run lint       # ESLint
npm run lint:fix   # ESLint with auto-fix
```

## Key Alignment Points with Backend

### 1. API Base URL Configuration
```typescript
// In core/api/client.ts or apiAdapter.ts
const API_BASE_URL = "/api/v1";  // Must match backend prefix
```

### 2. Response Format Matching
```typescript
// Frontend ApiResponse<T> matches backend exactly
interface ApiResponse<T> {
  success: boolean;
  status: HttpStatus;
  message: string;
  data: T | null;
  meta: ApiResponseMeta;  // Includes pagination
  errors: ApiError[] | null;
}
```

### 3. User Status Values
```typescript
// Frontend Status type matches backend exactly
type Status = "active" | "inactive" | "blocked" | "pending";
```

### 4. Permission Keys
- Frontend `PERMISSIONS` constants must match backend Permission `key` field
- Used in both `PermissionGuard` and backend RBAC middleware

### 5. Navigation Structure
- Backend returns `NavigationItem[]` with `permission` field
- Frontend consumes via `NavigationService` → `NavigationStore`
- Sidebar renders based on user permissions

### 6. Date Format
- Backend: ISO 8601 strings (Date.toISOString())
- Frontend: Expects ISO strings, formats for display

### 7. Pagination Parameters
```typescript
// Frontend UserQueryParams matches backend validation
interface UserQueryParams {
  search?: string;
  roleId?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}
```

### 8. Error Handling
- Backend returns `ApiError[]` in response.errors
- Frontend `ApiError` type matches: `{ code, message, field? }`
- Global error handling in `apiAdapter`

## Implemented Features

### ✅ Core Infrastructure
- [x] Vite + React 19 + TypeScript strict setup
- [x] Tailwind CSS 4 with Vite plugin
- [x] React Router 7 with nested routes
- [x] Zustand for state management
- [x] Axios-based ApiClient with adapter pattern
- [x] Mock backend for development
- [x] ESLint + TypeScript ESLint configuration

### ✅ Routing & Navigation
- [x] Feature-based route ownership
- [x] ProtectedRoute guard (authentication)
- [x] PermissionGuard guard (authorization)
- [x] AdminLayout with responsive sidebar
- [x] Navigation from backend API
- [x] Route helpers for type-safe navigation

### ✅ Authentication Module
- [x] Login page with validation
- [x] Register page
- [x] AuthService with typed methods
- [x] AuthApi with endpoint mapping
- [x] Auth store (Zustand) with persistence
- [x] AuthBootstrap for session restoration
- [x] Token refresh handling

### ✅ User Management
- [x] UserList page with table, pagination, filters
- [x] UserDetails view
- [x] UserForm (create/edit) with validation
- [x] UserApi with full CRUD
- [x] Permission-gated routes (pages.users)
- [x] User store with filters & selection

### ✅ Role Management
- [x] RoleAssignment component (matrix UI)
- [x] RoleApi with CRUD
- [x] Permission-gated routes (pages.assignment)
- [x] Role store

### ✅ Permission Management
- [x] Permissions table with module grouping
- [x] PermissionApi with CRUD
- [x] Permission-gated routes (pages.permissions)
- [x] Permission store

### ✅ Navigation Management
- [x] NavigationApi to fetch menu tree
- [x] NavigationService for sidebar rendering
- [x] Navigation store

### ✅ Dashboard & Overview
- [x] Dashboard page with stats cards
- [x] Overview page
- [x] Dashboard routes

### ✅ Settings & Logs
- [x] Settings page structure
- [x] Activity logs page structure
- [x] Routes defined

## Pending / Future Features
- [ ] Real backend integration (replace mockClient)
- [ ] Unit tests (Vitest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Storybook for component documentation
- [ ] Internationalization (i18n)
- [ ] Dark mode support
- [ ] Advanced table features (sorting, column visibility)
- [ ] Bulk actions for user/role/permission management
- [ ] User profile page
- [ ] Password change flow
- [ ] Email verification UI
- [ ] Two-factor authentication UI
- [ ] Audit log viewer
- [ ] Notification system
- [ ] File upload support
- [ ] Rich text editor for bio/description
- [ ] Drag-and-drop navigation builder
- [ ] Role permission matrix enhancements
- [ ] Performance monitoring
- [ ] PWA support
- [ ] Docker configuration
- [ ] CI/CD pipeline