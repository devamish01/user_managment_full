# Shared Development Instructions

This document contains patterns and conventions shared between backend and frontend development.

## TypeScript Configuration

### Strict Mode Requirements
Both backend and frontend use TypeScript strict mode. Always:
- Enable `strict: true` in tsconfig.json
- Avoid `any` type - use proper generics
- Use `unknown` instead of `any` when type is truly unknown
- Define explicit return types for public functions

### Import Aliases
```typescript
// Backend (backend/tsconfig.json)
"@/*": ["src/*"]

// Frontend (frontend/tsconfig.json)
"@/*": ["src/*"]
```

Usage:
```typescript
// Backend
import { successResponse } from "@/shared/response/index.js";
import { AppError } from "@/shared/errors/index.js";

// Frontend
import { api } from "@/core/api";
import { useAuthStore } from "@/modules/auth/store";
```

### File Extensions in Imports
- **Backend**: Always use `.js` extension in imports (ESM requirement)
  ```typescript
  import { User } from "@/modules/users/model/index.js";
  ```
- **Frontend**: No extension needed (Vite handles it)
  ```typescript
  import { User } from "@/modules/users/model";
  ```

---

## Error Handling Patterns

### Backend: AppError Class
```typescript
import { AppError } from "@/shared/errors/index.js";
import { HTTP_STATUS } from "@/shared/constants/http-status.js";

throw new AppError({
  message: "User-friendly error message",
  statusCode: HTTP_STATUS.BAD_REQUEST,
  errorCode: "VALIDATION_ERROR",
  details: { field: "email", issue: "invalid format" }, // optional
  isOperational: true, // default true
});
```

Properties:
- `message`: User-facing message
- `statusCode`: HTTP status code
- `errorCode`: Machine-readable error code
- `details`: Additional context for debugging
- `isOperational`: Whether error is expected (vs programming error)

### Frontend: Error Unwrapping
```typescript
// In Service layer
static async getUser(id: string): Promise<User | null> {
  const res = await UserApi.get(id);
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch user");
  }
  return res.data;
}

// In Store/Component
try {
  const user = await UserService.getUser(id);
} catch (err) {
  const message = err instanceof Error ? err.message : "Unknown error";
  // Handle error
}
```

---

## Response Format Standards

### Backend Response Structure
All API responses follow this format:
```typescript
interface ApiResponse<T> {
  success: boolean;
  status: number;           // HTTP status code
  message: string;          // Human-readable message
  data: T | null;           // Response payload
  meta: Record<string, unknown>; // Pagination, stats, etc.
  errors: unknown | null;   // Validation errors, etc.
}
```

### Response Helpers (Backend)
```typescript
import { successResponse, createdResponse, errorResponse } from "@/shared/response/index.js";

// Success (200)
return successResponse({ res, message: "Fetched", data: users, meta: { pagination } });

// Created (201)
return createdResponse({ res, message: "Created", data: user });

// Error (handled by errorMiddleware, but can use directly)
return errorResponse({ res, message: "Failed", statusCode: 400, errors: [...] });
```

### Frontend ApiResponse Type
```typescript
// In @/core/api/types.ts
interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
  meta: ApiResponseMeta;
  errors: ApiError[] | null;
}

interface ApiResponseMeta {
  pagination?: PaginationMeta;
  stats?: Record<string, unknown>;
  [key: string]: unknown;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

---

## Validation Patterns

### Backend: Zod Schemas
```typescript
// validations/create.schema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    roleId: z.string().min(1, "Role is required"),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
```

### Frontend: Zod + React Hook Form
```typescript
// In component
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/modules/users/validations"; // or local copy

const form = useForm<CreateUserInput>({
  resolver: zodResolver(createUserSchema.shape.body),
  defaultValues: { email: "", password: "", firstName: "", lastName: "", roleId: "" },
});
```

### Validation Middleware (Backend)
```typescript
import { validate } from "@/shared/middlewares/validate.middleware.js";
import { createUserSchema } from "@/modules/users/validations/index.js";

router.post(
  "/",
  authMiddleware,
  validate({ body: createUserSchema }),
  createUserController,
);

// For query params
router.get(
  "/",
  authMiddleware,
  validate({ query: userQuerySchema }),
  getUsersController,
);

// For params
router.get(
  "/:id",
  authMiddleware,
  validate({ params: userIdParamSchema }),
  getUserByIdController,
);
```

---

## Authentication & Authorization

### Backend: Auth Middleware
```typescript
import { authMiddleware } from "@/shared/middlewares/index.js";

// Apply to all routes in module
router.use(authMiddleware);

// Or apply to specific routes
router.get("/:id", authMiddleware, getUserController);
```

### Backend: AuthRequest Type
```typescript
import type { AuthRequest } from "@/shared/middlewares/auth.middleware.js";

export const myController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const roleId = req.user?.roleId;
    const isSuperAdmin = req.user?.isSuperAdmin;
    const sessionId = req.user?.sessionId;
  }
);
```

### Frontend: Permission Guard
```tsx
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { PERMISSIONS } from "@/lib/permissions";

// In routes.tsx
export const userRoutes: RouteObject[] = [
  {
    path: "users",
    element: <PermissionGuard permission={PERMISSIONS.PAGES_USERS} />,
    children: [...],
  },
];

// In components
import { useHasPermission } from "@/modules/auth/hooks";

const MyComponent = () => {
  const { hasPermission } = useHasPermission();
  
  if (hasPermission(PERMISSIONS.USERS_CREATE)) {
    return <CreateButton />;
  }
  return null;
};
```

### Permission Keys (Must Match Backend)
```typescript
// frontend/src/lib/permissions.ts
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

---

## Database Patterns (Backend)

### Mongoose Model Template
```typescript
// model/index.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roleId: string;
  status: "active" | "inactive" | "blocked" | "pending";
  // ... other fields
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    roleId: { type: String, required: true, index: true },
    status: { 
      type: String, 
      enum: ["active", "inactive", "blocked", "pending"], 
      default: "pending",
      index: true 
    },
    // ... other fields
  },
  { timestamps: true }
);

// Compound indexes for common queries
UserSchema.index({ status: 1, roleId: 1 });
UserSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>("User", UserSchema);
```

### Query Building Pattern
```typescript
// In service
const { page = 1, limit = 10, search, sortBy, sortOrder, ...filters } = query;
const skip = (page - 1) * limit;

const filter: any = {};

// Text search
if (search) {
  filter.$or = [
    { firstName: { $regex: search, $options: "i" } },
    { lastName: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } },
  ];
}

// Exact filters
Object.entries(filters).forEach(([key, value]) => {
  if (value !== undefined && value !== "") {
    filter[key] = value;
  }
});

// Sorting
const sort: any = {};
if (sortBy) {
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;
} else {
  sort.createdAt = -1; // default
}

const [data, total] = await Promise.all([
  Model.find(filter).sort(sort).skip(skip).limit(limit),
  Model.countDocuments(filter),
]);

return {
  data,
  pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  stats: { total },
};
```

---

## State Management Patterns (Frontend)

### useSyncExternalStore Pattern
```typescript
// store/module.store.ts
import { useCallback, useSyncExternalStore } from "react";
import { ModuleService } from "../services";
import type { ModuleState, ModuleItem } from "../types";

type Listener = () => void;
const listeners = new Set<Listener>();
const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const emit = () => listeners.forEach((l) => l());

let state: ModuleState = {
  items: [],
  selectedItem: null,
  filters: { page: 1, limit: 10, search: "", sortBy: "", sortOrder: "asc" },
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  loading: false,
  error: null,
};

const patch = (next: Partial<ModuleState>) => {
  state = { ...state, ...next };
  emit();
};

// Stable action references
const fetchList = async (params?: QueryParams) => { ... };
const fetchOne = async (id: string) => { ... };
const create = async (data: CreateInput) => { ... };
const update = async (id: string, data: UpdateInput) => { ... };
const deleteItem = async (id: string) => { ... };
const setFilters = (filters: Partial<QueryParams>) => { ... };
const clearError = () => patch({ error: null });

const getSnapshot = () => state;
const getServerSnapshot = () => state;

export const useModuleStore = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export const useModuleActions = () => ({
  fetchList: useCallback(fetchList, []),
  fetchOne: useCallback(fetchOne, []),
  create: useCallback(create, []),
  update: useCallback(update, []),
  delete: useCallback(deleteItem, []),
  setFilters: useCallback(setFilters, []),
  clearError: useCallback(clearError, []),
});
```

### Using Store in Components
```tsx
// In component
const { items, loading, error, pagination, filters } = useModuleStore();
const { fetchList, setFilters, delete: deleteItem } = useModuleActions();

useEffect(() => {
  fetchList(filters);
}, [fetchList, filters]);

const handlePageChange = (page: number) => {
  setFilters({ page });
};

const handleSearch = (search: string) => {
  setFilters({ search, page: 1 });
};

const handleDelete = async (id: string) => {
  if (confirm("Delete?")) {
    await deleteItem(id);
  }
};
```

---

## Routing Patterns

### Backend Route Registration
```typescript
// backend/src/routes/index.ts
import { Router } from "express";
import { authRoutes } from "@/modules/auth/routes/index.js";
import { userRoutes } from "@/modules/users/routes/index.js";
import { roleRoutes } from "@/modules/roles/routes/index.js";
import { permissionRoutes } from "@/modules/permissions/routes/index.js";

const routes = Router();

routes.use("/health", healthRoutes);
routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/roles", roleRoutes);
routes.use("/permissions", permissionRoutes);

export default routes;
```

### Frontend Route Registration
```typescript
// frontend/src/router/routes.tsx
import { userRoutes } from "@/modules/users/routes";
import { roleRoutes } from "@/modules/roles/routes";
import { permissionRoutes } from "@/modules/permissions/routes";

const protectedFeatureRoutes: RouteObject[] = [
  ...dashboardRoutes,
  ...userRoutes,
  ...roleRoutes,
  ...permissionRoutes,
  ...logsRoutes,
  ...settingsRoutes,
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppRoot />,
    children: [
      ...authRoutes,
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminShell />,
            children: [
              { index: true, element: <Navigate to="/dashboard" replace /> },
              ...protectedFeatureRoutes,
              { path: "*", element: <NotFound /> },
            ],
          },
        ],
      },
    ],
  },
  // ... error routes
]);
```

---

## Environment Configuration

### Backend: Validated Env
```typescript
// backend/src/config/env.ts
import { cleanEnv, str, num, bool, port } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production", "test"], default: "development" }),
  PORT: port({ default: 3000 }),
  MONGODB_URI: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_EXPIRY: str({ default: "15m" }),
  JWT_REFRESH_EXPIRY: str({ default: "7d" }),
  CORS_ORIGIN: str({ default: "http://localhost:5173" }),
  LOG_LEVEL: str({ choices: ["debug", "info", "warn", "error"], default: "info" }),
});
```

### Frontend: Vite Env
```typescript
// frontend/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## Logging

### Backend: Pino Logger
```typescript
// backend/src/shared/logger/index.ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: process.env.NODE_ENV !== "production" 
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
});

// Usage
import { logger } from "@/shared/logger/index.js";

logger.info({ userId }, "User logged in");
logger.error({ err, userId }, "Login failed");
```

---

## Testing Patterns

### Backend: Jest + Supertest
```typescript
// tests/users.test.ts
import request from "supertest";
import { app } from "@/app.js";
import { User } from "@/modules/users/model/index.js";

describe("Users API", () => {
  let authToken: string;
  
  beforeAll(async () => {
    // Login and get token
    const res = await request(app).post("/api/v1/auth/login").send({...});
    authToken = res.body.data.session.accessToken;
  });
  
  it("GET /users - should return paginated users", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);
    
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta.pagination).toBeDefined();
  });
});
```

### Frontend: Vitest + React Testing Library
```typescript
// modules/users/components/UserList.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { UserList } from "@/modules/users/pages/UserList";
import { useUserStore } from "@/modules/users/store";

// Mock store
vi.mock("@/modules/users/store", () => ({
  useUserStore: () => ({
    items: [{ userId: "1", firstName: "John", lastName: "Doe", email: "john@example.com" }],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
  }),
  useUserActions: () => ({
    fetchList: vi.fn(),
    delete: vi.fn(),
    setFilters: vi.fn(),
  }),
}));

it("renders user list", () => {
  render(<UserList />);
  expect(screen.getByText("John Doe")).toBeInTheDocument();
});
```

---

## Git Conventions

### Branch Naming
- `feature/<module>-<description>` - New features
- `fix/<module>-<description>` - Bug fixes
- `refactor/<module>-<description>` - Code improvements
- `docs/<description>` - Documentation updates
- `chore/<description>` - Maintenance tasks

### Commit Messages (Conventional Commits)
```
feat(users): add user export functionality
fix(auth): handle expired refresh token correctly
refactor(shared): extract common validation logic
docs: update module creation guide
chore: update dependencies
```

### PR Requirements
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Follows module patterns
- [ ] Includes barrel exports
- [ ] Permission keys aligned (if applicable)
- [ ] Documentation updated

---

## Performance Considerations

### Backend
- Use database indexes for query fields
- Implement pagination for all list endpoints
- Use `lean()` for read-only queries: `Model.find().lean()`
- Select only needed fields: `.select("name email")`
- Use `Promise.all()` for parallel queries

### Frontend
- Memoize expensive computations with `useMemo`
- Use `React.memo` for pure components
- Implement virtual scrolling for large lists
- Debounce search inputs
- Use `useCallback` for event handlers passed to children

---

## Security Best Practices

### Backend
- Never log sensitive data (passwords, tokens)
- Validate all inputs with Zod
- Use `helmet()` for security headers
- Implement rate limiting
- Sanitize user input for database queries
- Use parameterized queries (Mongoose handles this)

### Frontend
- Never store tokens in localStorage (use memory + HttpOnly cookies)
- Sanitize user input before rendering
- Use `dangerouslySetInnerHTML` only with trusted content
- Implement CSP headers via backend

---

## Code Review Checklist

### For Every PR
- [ ] Follows module structure patterns
- [ ] Barrel exports in all index.ts files
- [ ] Proper TypeScript types (no `any`)
- [ ] Error handling with AppError / thrown Errors
- [ ] Validation on all inputs
- [ ] Auth middleware on protected routes
- [ ] Permission guards on frontend routes
- [ ] Standardized response format
- [ ] Loading/error states in UI
- [ ] Pagination for lists
- [ ] Tests for new functionality
- [ ] No console.log in production code
- [ ] Environment variables for config
- [ ] Permission keys match backend

---

## Useful Commands

### Backend
```bash
cd backend
npm run dev              # Start with hot reload
npm run build            # TypeScript compile
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Frontend
```bash
cd frontend
npm run dev              # Vite dev server
npm run build            # Production build
npm run preview          # Preview build
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run test             # Vitest
npm run test:ui          # Vitest UI
```

### Full Stack
```bash
# From root
npm run dev              # Start both (if configured)
npm run build            # Build both
npm run lint             # Lint both
```

---

## Quick Reference: File Templates

### Backend Controller Template
```typescript
import type { Request, Response } from "express";
import type { AuthRequest } from "@/shared/middlewares/auth.middleware.js";
import { successResponse, createdResponse } from "@/shared/response/index.js";
import { MODULE_MESSAGES } from "@/modules/<module>/constants/index.js";
import { asyncHandler } from "@/shared/middlewares/index.js";
import { action } from "@/modules/<module>/services/index.js";
import { schema } from "@/modules/<module>/validations/index.js";
import type { I<Module> } from "@/modules/<module>/model/index.js";

export const actionController = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const result = await action(req.body, req.user?.userId);
    return createdResponse<I<Module>>({
      res,
      message: MODULE_MESSAGES.CREATE_SUCCESS,
      data: result,
    });
  },
);
```

### Frontend Service Template
```typescript
import { ModuleApi } from "../api";
import type { ModuleItem } from "@/lib/types";
import type { CreateModuleInput, UpdateModuleInput } from "../types";

export class ModuleService {
  static async create(data: CreateModuleInput): Promise<ModuleItem> {
    const res = await ModuleApi.create(data);
    if (!res.success || !res.data) throw new Error(res.message || "Creation failed");
    return res.data;
  }
}
```

---

**Remember**: Consistency across the codebase is more important than individual preferences. When in doubt, follow the existing patterns in `auth`, `users`, `roles`, and `permissions` modules.