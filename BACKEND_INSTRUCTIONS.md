# Backend Architecture & API Documentation

## Project Overview
**Nexus Backend** - Production-ready modular backend built with Node.js, Express, TypeScript, and MongoDB.

## Tech Stack
- **Runtime**: Node.js >= 22.0.0 (ES Modules)
- **Framework**: Express 5.x
- **Database**: MongoDB with Mongoose 9.x
- **Language**: TypeScript 5.x (strict mode)
- **Validation**: Zod 4.x
- **Auth**: JWT (jsonwebtoken), bcrypt 6.x
- **Logging**: Pino + pino-http + pino-pretty
- **Security**: Helmet, CORS, express-rate-limit
- **Config**: dotenv + envalid

## Project Structure
```
backend/
├── src/
│   ├── server.ts              # Entry point - DB connection, seeding, server start
│   ├── app.ts                 # Express app setup, middleware, routes
│   ├── config/
│   │   ├── env.ts             # Validated environment variables
│   │   └── index.ts           # Config barrel export
│   ├── core/
│   │   ├── index.ts           # Core barrel
│   │   └── database/
│   │       ├── index.ts       # Database barrel
│   │       └── mongoose.ts    # Mongoose connection logic
│   ├── modules/               # Feature modules (domain-driven)
│   │   ├── auth/              # Authentication & authorization
│   │   ├── health/            # Health check endpoint
│   │   ├── navigation/        # Navigation menu management
│   │   ├── permissions/       # Permission CRUD & registry
│   │   ├── roles/             # Role CRUD & assignment
│   │   ├── sessions/          # Session management
│   │   └── users/             # User CRUD & management
│   ├── routes/
│   │   ├── index.ts           # Main router aggregator
│   │   └── README.md
│   ├── shared/                # Cross-cutting concerns
│   │   ├── constants/
│   │   ├── database/
│   │   ├── errors/
│   │   ├── logger/
│   │   ├── middlewares/
│   │   ├── module-metadata/
│   │   ├── response/
│   │   ├── types/
│   │   └── utils/
│   └── types/                 # Global types
├── package.json
├── tsconfig.json
└── ROADMAP.md
```

## API Endpoints (Base: `/api/v1`)

### Auth Module (`/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Auth status check | Public |
| POST | `/register` | User registration | Public |
| POST | `/login` | User login | Public |
| POST | `/refresh` | Refresh access token | Public |
| POST | `/logout` | User logout | Required |
| GET | `/me` | Current user profile | Required |
| GET | `/session` | Current session info | Required |

### Users Module (`/users`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List users (paginated, filterable) | Required |
| POST | `/` | Create user | Required |
| GET | `/:id` | Get user by ID | Required |
| PUT | `/:id` | Update user (full) | Required |
| PATCH | `/:id` | Update user (partial) | Required |
| DELETE | `/:id` | Delete user | Required |
| POST | `/:id/reset-password` | Reset user password | Required |

### Roles Module (`/roles`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List roles (paginated, filterable) | Required |
| POST | `/` | Create role | Required |
| PUT | `/:id` | Update role (full) | Required |
| PATCH | `/:id` | Update role (partial) | Required |
| DELETE | `/:id` | Delete role | Required |

### Permissions Module (`/permissions`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List permissions (paginated, filterable) | Required |
| GET | `/:id` | Get permission by ID | Required |
| POST | `/` | Create permission | Required |
| PUT | `/:id` | Update permission (full) | Required |
| PATCH | `/:id` | Update permission (partial) | Required |
| DELETE | `/:id` | Delete permission | Required |

### Navigation Module (`/navigation`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get navigation tree | Required |

### Health Module (`/health`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Health check | Public |

## Data Models

### User (`IUser`)
```typescript
interface IUser {
  userId: string;           // Unique user identifier
  username: string;         // Unique username
  firstName: string;
  lastName: string;
  email: string;            // Unique email
  password: string;         // Hashed password
  role: string;             // Role name (denormalized)
  roleId: string;           // Reference to Role
  status: string;           // active | inactive | blocked | pending
  isProtected: boolean;     // Protected from modification
  approvedAt: Date | null;
  approvedBy: string | null;
  approvedByName?: string | null;
  phone: string;
  location: string;
  address: string;
  bio: string;
  lastActive: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Role (`IRole`)
```typescript
interface IRole {
  roleId: string;           // Unique role identifier
  name: string;             // Unique role name
  description: string;
  permissionIds: string[];  // Array of permission IDs
  color: string;            // UI color gradient
  isSystem: boolean;        // System role (non-deletable)
  isSuperAdmin: boolean;    // Super admin role
  createdBy: string;        // User ID who created
  createdAt: Date;
  updatedAt: Date;
}
```

### Permission (`IPermission`)
```typescript
interface IPermission {
  permissionId: string;     // Unique permission identifier
  id: string;               // Legacy ID field
  name: string;             // Display name
  key: string;              // Unique key (e.g., "users.create")
  module: string;           // Module grouping (e.g., "users")
  description: string;
  assignedRolesCount: number;
}
```

### Navigation (`NavigationItem`)
```typescript
interface NavigationItem {
  id: string;
  title: string;
  order: number;
  visible: boolean;
  icon?: string;
  route?: string;
  permission?: string;      // Required permission to view
  children?: NavigationItem[];
}
```

## Authentication & Authorization

### JWT Token Structure
- **Access Token**: Short-lived (15min), contains userId, roleId, permissions
- **Refresh Token**: Long-lived (7d), httpOnly cookie, rotation on use

### Middleware Chain
1. `helmet()` - Security headers
2. `cors()` - Cross-origin
3. `express.json()` - Body parsing
4. `cookieParser()` - Cookie parsing
5. `authMiddleware` - JWT verification (attaches `req.user`)
6. Route-specific validation middleware
7. Controller handlers

### Permission System
- Permissions are string keys: `module.action` (e.g., `users.create`)
- Roles contain array of permission IDs
- Frontend checks permissions via `PermissionGuard` component
- Backend validates via middleware (to be implemented)

## Seeding (Auto-run on startup)
1. `seedPermissions()` - Creates base permissions from registry
2. `seedRoles()` - Creates default roles (Super Admin, Admin, User, Viewer)
3. `seedSuperAdminUser()` - Creates initial super admin user

## Environment Variables
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
BCRYPT_ROUNDS=12
```

## Development Commands
```bash
npm run dev        # Start dev server with hot reload (tsx watch)
npm run build      # Compile TypeScript (tsc + tsc-alias)
npm run start      # Run compiled production build
npm run type-check # Type check without emit
npm run lint       # ESLint
npm run format     # Prettier
```

## Key Alignment Points with Frontend

### 1. API Base URL
- Backend: `/api/v1` prefix on all routes
- Frontend: Configured in `ApiClient` base URL

### 2. Endpoint Naming Convention
- Backend: RESTful (`/users`, `/users/:id`, `/roles`, etc.)
- Frontend: Mirrors exactly in `modules/*/api/*.endpoints.ts`

### 3. Response Format
```typescript
// Backend standard response
{
  success: boolean;
  status: number;
  message: string;
  data: T | null;
  meta: PaginationMeta;
  errors: ApiError[] | null;
}
```
- Frontend `ApiResponse<T>` type matches exactly

### 4. Authentication Flow
- Login: `POST /api/v1/auth/login` → returns access token + sets refresh cookie
- Refresh: `POST /api/v1/auth/refresh` → rotates tokens
- Logout: `POST /api/v1/auth/logout` → clears cookies
- Me: `GET /api/v1/auth/me` → returns current user

### 5. User Status Values
- Backend: `active | inactive | blocked | pending`
- Frontend: `Status` type matches exactly

### 6. Permission Keys
- Backend: Stored as `key` field in Permission model (e.g., `users.create`)
- Frontend: Used in `PermissionGuard` component prop

### 7. Navigation Structure
- Backend: Single document with `items: NavigationItem[]`
- Frontend: Consumed by `NavigationService` for sidebar rendering

## Implemented Features

### ✅ Core Infrastructure
- [x] Express 5 + TypeScript strict mode setup
- [x] MongoDB/Mongoose connection with proper typing
- [x] Environment validation with envalid
- [x] Structured logging with Pino
- [x] Error handling middleware (global + not found)
- [x] Request validation middleware (Zod)
- [x] CORS, Helmet, Rate limiting

### ✅ Authentication Module
- [x] User registration with validation
- [x] Login with JWT access + refresh tokens
- [x] Token refresh with rotation
- [x] Logout with cookie clearing
- [x] Current user profile (`/me`)
- [x] Session info endpoint
- [x] Password hashing with bcrypt

### ✅ User Management
- [x] CRUD operations (Create, Read, Update, Delete)
- [x] Pagination, filtering, sorting
- [x] Password reset by admin
- [x] User status management
- [x] Protected user flag (prevents deletion)

### ✅ Role Management
- [x] CRUD operations
- [x] Permission assignment (array of permission IDs)
- [x] System role protection
- [x] Super admin role flag
- [x] Color coding for UI

### ✅ Permission Management
- [x] CRUD operations
- [x] Module-based grouping
- [x] Unique key enforcement
- [x] Assigned roles count tracking
- [x] Registry-based seeding

### ✅ Navigation Management
- [x] Hierarchical menu structure
- [x] Visibility toggles
- [x] Permission-gated items
- [x] Order-based sorting
- [x] Icon support

### ✅ Seeding System
- [x] Permissions from registry
- [x] Default roles with permissions
- [x] Super admin user creation

## Pending / Future Features
- [ ] Session management module (active sessions, revoke)
- [ ] RBAC middleware for route-level permission checks
- [ ] Audit logging / activity logs
- [ ] Email verification flow
- [ ] Password reset via email
- [ ] Two-factor authentication
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Unit & integration tests
- [ ] Docker configuration
- [ ] CI/CD pipeline