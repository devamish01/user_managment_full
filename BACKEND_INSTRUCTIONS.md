# Backend Development Instructions

## Module Structure Template

```
backend/src/modules/<module-name>/
├── constants/
│   ├── index.ts          # Barrel export
│   └── messages.ts       # SUCCESS_MESSAGES, ERROR_MESSAGES
├── controllers/
│   ├── index.ts          # Barrel export
│   └── <action>.controller.ts
├── services/
│   ├── index.ts          # Barrel export
│   └── <action>.service.ts
├── model/
│   ├── index.ts          # Mongoose model export
│   └── <module>.type.ts  # TypeScript interface
├── routes/
│   ├── index.ts          # Barrel export
│   └── <module>.route.ts # Express router
├── types/
│   ├── index.ts          # Barrel export
│   └── <type>.type.ts    # Request/Response types
├── utils/
│   ├── index.ts          # Barrel export
│   └── <utility>.ts
├── validations/
│   ├── index.ts          # Barrel export
│   └── <schema>.schema.ts # Zod schemas
└── index.ts              # Main barrel export
```

## Required Files for Every Module

### 1. Constants (`constants/messages.ts`)
```typescript
export const MODULE_MESSAGES = {
  MODULE_RUNNING: "<Module> module is running",
  FETCH_SUCCESS: "<Resource> fetched successfully",
  FETCH_ONE_SUCCESS: "<Resource> fetched successfully",
  CREATE_SUCCESS: "<Resource> created successfully",
  UPDATE_SUCCESS: "<Resource> updated successfully",
  DELETE_SUCCESS: "<Resource> deleted successfully",
  NOT_FOUND: "<Resource> not found",
  ALREADY_EXISTS: "<Resource> already exists",
} as const;

export const MODULE_ERRORS = {
  INVALID_INPUT: "Invalid input provided",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
} as const;
```

### 2. Model (`model/index.ts`)
```typescript
import mongoose, { Document, Schema } from "mongoose";

export interface I<Module> extends Document {
  <field>: <type>;
  // Always include:
  userId: string;  // Primary identifier (not _id)
  createdAt: Date;
  updatedAt: Date;
}

const <Module>Schema = new Schema<I<Module>>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    // ... other fields
  },
  { timestamps: true }
);

export const <Module> = mongoose.model<I<Module>>("<Module>", <Module>Schema);
```

### 3. Validations (`validations/<schema>.schema.ts`)
```typescript
import { z } from "zod";

export const create<Module>Schema = z.object({
  body: z.object({
    field: z.string().min(1, "Field is required"),
  }),
});

export const update<Module>Schema = z.object({
  body: z.object({
    field: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
});

export const <module>QuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export type Create<Module>Input = z.infer<typeof create<Module>Schema>["body"];
export type Update<Module>Input = z.infer<typeof update<Module>Schema>["body"];
export type <Module>QueryParams = z.infer<typeof <module>QuerySchema>["query"];
```

### 4. Services (`services/<action>.service.ts`)
```typescript
import { <Module> } from "@/modules/<module>/model/index.js";
import { MODULE_MESSAGES, MODULE_ERRORS } from "@/modules/<module>/constants/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";
import { AppError } from "@/shared/errors/index.js";
import type { Create<Module>Input, Update<Module>Input, <Module>QueryParams } from "@/modules/<module>/validations/index.js";

export const create<Module> = async (data: Create<Module>Input, userId?: string) => {
  // Check duplicates
  const existing = await <Module>.findOne({ field: data.field });
  if (existing) {
    throw new AppError({
      message: MODULE_ERRORS.ALREADY_EXISTS,
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: "ALREADY_EXISTS",
    });
  }

  const <module> = await <Module>.create({ ...data, userId });
  return <module>;
};

export const get<Module>s = async (query: <Module>QueryParams) => {
  const { page = 1, limit = 10, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (search) {
    filter.$or = [{ field: { $regex: search, $options: "i" } }];
  }

  const sort: any = {};
  if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  const [data, total] = await Promise.all([
    <Module>.find(filter).sort(sort).skip(skip).limit(limit),
    <Module>.countDocuments(filter),
  ]);

  return {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    stats: { total },
  };
};

export const get<Module>ById = async (id: string) => {
  const <module> = await <Module>.findOne({ userId: id });
  if (!<module>) {
    throw new AppError({
      message: MODULE_ERRORS.NOT_FOUND,
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "NOT_FOUND",
    });
  }
  return <module>;
};

export const update<Module> = async (id: string, data: Update<Module>Input, userId?: string, userRole?: string) => {
  const <module> = await get<Module>ById(id);
  
  // Authorization check
  if (userRole !== "super-admin" && <module>.userId !== userId) {
    throw new AppError({
      message: MODULE_ERRORS.FORBIDDEN,
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "FORBIDDEN",
    });
  }

  Object.assign(<module>, data);
  await <module>.save();
  return <module>;
};

export const delete<Module> = async (id: string, userRole?: string) => {
  const <module> = await get<Module>ById(id);
  
  if (userRole !== "super-admin") {
    throw new AppError({
      message: MODULE_ERRORS.FORBIDDEN,
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: "FORBIDDEN",
    });
  }

  await <module>.deleteOne();
  return { ok: true };
};
```

### 5. Controllers (`controllers/<action>.controller.ts`)
```typescript
import type { Request, Response } from "express";
import type { AuthRequest } from "@/shared/middlewares/auth.middleware.js";
import { successResponse, createdResponse } from "@/shared/response/index.js";
import { MODULE_MESSAGES } from "@/modules/<module>/constants/index.js";
import { asyncHandler } from "@/shared/middlewares/index.js";
import { create<Module>, get<Module>s, get<Module>ById, update<Module>, delete<Module> } from "@/modules/<module>/services/index.js";
import { create<Module>Schema, update<Module>Schema, <module>QuerySchema } from "@/modules/<module>/validations/index.js";
import type { I<Module> } from "@/modules/<module>/model/index.js";

export const get<Module>sController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const result = await get<Module>s(req.query as any);
    return successResponse<I<Module>[]>({
      res,
      message: MODULE_MESSAGES.FETCH_SUCCESS,
      data: result.data,
      meta: { pagination: result.pagination, stats: result.stats },
    });
  },
);

export const get<Module>ByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const <module> = await get<Module>ById(req.params.id as string);
    return successResponse<I<Module>>({
      res,
      message: MODULE_MESSAGES.FETCH_ONE_SUCCESS,
      data: <module>,
    });
  },
);

export const create<Module>Controller = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const <module> = await create<Module>(req.body, req.user?.userId);
    return createdResponse<I<Module>>({
      res,
      message: MODULE_MESSAGES.CREATE_SUCCESS,
      data: <module>,
    });
  },
);

export const update<Module>Controller = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const <module> = await update<Module>(req.params.id as string, req.body, req.user?.userId, req.user?.role);
    return successResponse<I<Module>>({
      res,
      message: MODULE_MESSAGES.UPDATE_SUCCESS,
      data: <module>,
    });
  },
);

export const delete<Module>Controller = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    await delete<Module>(req.params.id as string, req.user?.role);
    return successResponse({
      res,
      message: MODULE_MESSAGES.DELETE_SUCCESS,
      data: { ok: true },
    });
  },
);
```

### 6. Routes (`routes/<module>.route.ts`)
```typescript
import { Router } from "express";
import {
  get<Module>sController,
  get<Module>ByIdController,
  create<Module>Controller,
  update<Module>Controller,
  delete<Module>Controller,
} from "@/modules/<module>/controllers/index.js";
import { validate } from "@/shared/middlewares/validate.middleware.js";
import { authMiddleware } from "@/shared/middlewares/index.js";
import { create<Module>Schema, update<Module>Schema, <module>QuerySchema } from "@/modules/<module>/validations/index.js";

export const <module>Routes = Router();

// All routes require authentication
<module>Routes.use(authMiddleware);

<module>Routes.get(
  "/",
  validate({ query: <module>QuerySchema }),
  get<Module>sController,
);

<module>Routes.post(
  "/",
  validate({ body: create<Module>Schema }),
  create<Module>Controller,
);

<module>Routes.get(
  "/:id",
  get<Module>ByIdController,
);

<module>Routes.put(
  "/:id",
  validate({ body: update<Module>Schema }),
  update<Module>Controller,
);

<module>Routes.patch(
  "/:id",
  validate({ body: update<Module>Schema }),
  update<Module>Controller,
);

<module>Routes.delete(
  "/:id",
  delete<Module>Controller,
);
```

### 7. Main Index (`index.ts`)
```typescript
export * from "./constants/index.js";
export * from "./controllers/index.js";
export * from "./services/index.js";
export * from "./model/index.js";
export * from "./model/<module>.type.js";
export * from "./validations/index.js";
export * from "./routes/<module>.route.js";
```

### 8. Register in Main Routes (`backend/src/routes/index.ts`)
```typescript
import { <module>Routes } from "@/modules/<module>/routes/index.js";

// Add to routes
routes.use("/<module>", <module>Routes);
```

## Key Patterns to Follow

### 1. Always Use asyncHandler
```typescript
import { asyncHandler } from "@/shared/middlewares/index.js";

export const myController = asyncHandler(async (req, res) => {
  // No try-catch needed
});
```

### 2. Use Standardized Responses
```typescript
import { successResponse, createdResponse, errorResponse } from "@/shared/response/index.js";

return successResponse({ res, message: "Success", data });
return createdResponse({ res, message: "Created", data });
return errorResponse({ res, message: "Error", statusCode: 400 });
```

### 3. Throw AppError for Errors
```typescript
import { AppError } from "@/shared/errors/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";

throw new AppError({
  message: "Error message",
  statusCode: HTTP_STATUS.BAD_REQUEST,
  errorCode: "ERROR_CODE",
  details: { field: "value" }, // optional
});
```

### 4. Use validate Middleware
```typescript
import { validate } from "@/shared/middlewares/validate.middleware.js";
import { mySchema } from "@/modules/<module>/validations/index.js";

router.post("/", validate({ body: mySchema }), controller);
router.get("/", validate({ query: querySchema }), controller);
```

### 5. Use Auth Middleware for Protected Routes
```typescript
import { authMiddleware } from "@/shared/middlewares/index.js";

router.use(authMiddleware); // Apply to all routes
// OR
router.get("/:id", authMiddleware, controller); // Apply to specific route
```

### 6. Type AuthRequest for Authenticated Routes
```typescript
import type { AuthRequest } from "@/shared/middlewares/auth.middleware.js";

export const myController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId; // TypeScript knows this exists
    const role = req.user?.role;
  }
);
```

## Database Patterns

### Query Building
```typescript
const filter: any = {};
if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }];
if (status) filter.status = status;

const sort: any = {};
if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;

const data = await Model.find(filter).sort(sort).skip(skip).limit(limit);
const total = await Model.countDocuments(filter);
```

### Population
```typescript
const data = await Model.find(filter)
  .populate("roleId", "name")
  .populate("createdBy", "username");
```

## Testing Checklist for New Modules
- [ ] Unit tests for services
- [ ] Integration tests for controllers
- [ ] Validation schema tests
- [ ] Error handling tests
- [ ] Authorization tests

## Common Mistakes to Avoid
1. ❌ Putting business logic in controllers
2. ❌ Not using asyncHandler (unhandled promise rejections)
3. ❌ Using res.json() directly instead of response helpers
4. ❌ Throwing plain Error instead of AppError
5. ❌ Forgetting validate middleware
6. ❌ Not exporting from module index.ts
7. ❌ Using _id instead of userId
8. ❌ Not registering routes in main routes/index.ts

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