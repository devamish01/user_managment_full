# Frontend Development Instructions

## Module Structure Template

```
frontend/src/modules/<module-name>/
├── api/
│   ├── <module>.endpoints.ts    # URL constants only
│   ├── <module>.api.ts          # ApiClient wrapper with typed methods
│   └── index.ts                 # Barrel export
├── components/
│   ├── <Component>.tsx          # Reusable components
│   └── index.ts                 # Barrel export
├── hooks/
│   ├── use<Feature>.ts          # Custom hooks
│   └── index.ts                 # Barrel export
├── pages/
│   ├── <Page>.tsx               # Page-level components
│   └── index.ts                 # Barrel export
├── routes.tsx                   # Route definitions (RouteObject[])
├── services/
│   ├── <module>.service.ts      # Business logic layer
│   └── index.ts                 # Barrel export
├── store/
│   ├── <module>.store.ts        # Zustand store (useSyncExternalStore)
│   └── index.ts                 # Barrel export
├── types/
│   ├── index.ts                 # Barrel export
│   └── <type>.ts                # Module-specific types
├── utils/
│   ├── index.ts                 # Barrel export
│   └── <utility>.ts
├── shared/
│   ├── components/              # Shared components within module
│   ├── constants/               # Shared constants within module
│   └── types/                   # Shared types within module
└── index.ts                     # Main barrel export
```

## Required Files for Every Module

### 1. Endpoints (`api/<module>.endpoints.ts`)
```typescript
/**
 * <Module> module endpoint registry.
 * Contains only URL definitions — no HTTP logic, no business logic.
 */

export const <MODULE>_LIST = "/<module>";
export const <MODULE>_DETAILS = (id: string) => `/<module>/${id}`;
export const <MODULE>_ACTION = "/<module>/action";
```

### 2. API Class (`api/<module>.api.ts`)
```typescript
/**
 * <Module> module API layer.
 * Thin HTTP wrapper around `core/api/client` that knows only the <Module> endpoints.
 */

import { api } from "@/core/api";
import type { ApiResponse } from "@/core/api";
import type { <Type> } from "@/lib/types";
import type { Create<Module>Input, Update<Module>Input, <Module>QueryParams } from "../types";
import { <MODULE>_LIST, <MODULE>_DETAILS } from "./<module>.endpoints";

export class <Module>Api {
  static list(params?: <Module>QueryParams): Promise<ApiResponse<{ data: <Type>[]; pagination: any; stats: any }>> {
    return api.get<{ data: <Type>[]; pagination: any; stats: any }>(<MODULE>_LIST, { params });
  }

  static get(id: string): Promise<ApiResponse<<Type>>> {
    return api.get<<Type>>(<MODULE>_DETAILS(id));
  }

  static create(data: Create<Module>Input): Promise<ApiResponse<<Type>>> {
    return api.post<<Type>>(<MODULE>_LIST, data);
  }

  static update(id: string, data: Update<Module>Input): Promise<ApiResponse<<Type>>> {
    return api.put<<Type>>(<MODULE>_DETAILS(id), data);
  }

  static delete(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(<MODULE>_DETAILS(id));
  }
}
```

### 3. Service Class (`services/<module>.service.ts`)
```typescript
/**
 * <Module>Service — public surface of the <Module> feature module.
 * All HTTP calls are delegated to `<Module>Api`; this service never reaches
 * directly into the core HTTP client.
 */

import { <Module>Api } from "../api";
import type { <Type> } from "@/lib/types";
import type { Create<Module>Input, Update<Module>Input, <Module>QueryParams } from "../types";

export class <Module>Service {
  static async list(params?: <Module>QueryParams) {
    const res = await <Module>Api.list(params);
    if (!res.success) throw new Error(res.message || "Failed to fetch");
    return res.data;
  }

  static async get(id: string): Promise<<Type> | null> {
    const res = await <Module>Api.get(id);
    return res.success ? res.data : null;
  }

  static async create(data: Create<Module>Input): Promise<<Type>> {
    const res = await <Module>Api.create(data);
    if (!res.success || !res.data) throw new Error(res.message || "Creation failed");
    return res.data;
  }

  static async update(id: string, data: Update<Module>Input): Promise<<Type>> {
    const res = await <Module>Api.update(id, data);
    if (!res.success || !res.data) throw new Error(res.message || "Update failed");
    return res.data;
  }

  static async delete(id: string): Promise<void> {
    const res = await <Module>Api.delete(id);
    if (!res.success) throw new Error(res.message || "Deletion failed");
  }
}
```

### 4. Store (`store/<module>.store.ts`)
```typescript
/**
 * use<Module>Store — feature store for the <Module> module.
 * Owns <module> state as a module-level singleton so every consumer
 * sees the same state without requiring a Context provider in the React tree.
 * Built on `useSyncExternalStore`.
 */

import { useCallback, useSyncExternalStore } from "react";
import { <Module>Service } from "../services";
import type { <Module>State, Create<Module>Input, Update<Module>Input, <Module>QueryParams } from "../types";
import type { <Type> } from "@/lib/types";

export interface <Module>StoreState extends <Module>State {
  fetchList: (params?: <Module>QueryParams) => Promise<<Type>[]>;
  fetchOne: (id: string) => Promise<<Type> | null>;
  create: (data: Create<Module>Input) => Promise<<Type> | null>;
  update: (id: string, data: Update<Module>Input) => Promise<<Type> | null>;
  delete: (id: string) => Promise<void>;
  setFilters: (filters: Partial<<Module>QueryParams>) => void;
  clearError: () => void;
}

/* ── module-level singleton state ─────────────────────────────── */
type Listener = () => void;
const listeners = new Set<Listener>();
const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const emit = () => listeners.forEach((l) => l());

let state: <Module>State = {
  items: [],
  selectedItem: null,
  filters: { page: 1, limit: 10, search: "", sortBy: "", sortOrder: "asc" },
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  loading: false,
  error: null,
};

const patch = (next: Partial<<Module>State>) => {
  state = { ...state, ...next };
  emit();
};

/* ── actions (stable references) ──────────────────────────────── */
const fetchList = async (params?: <Module>QueryParams): Promise<<Type>[]> => {
  patch({ loading: true, error: null });
  try {
    const result = await <Module>Service.list(params);
    patch({ 
      items: result.data, 
      pagination: result.pagination, 
      stats: result.stats,
      loading: false 
    });
    return result.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch";
    patch({ error: message, loading: false });
    return [];
  }
};

const fetchOne = async (id: string): Promise<<Type> | null> => {
  patch({ loading: true, error: null });
  try {
    const item = await <Module>Service.get(id);
    patch({ selectedItem: item, loading: false });
    return item;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch";
    patch({ error: message, loading: false });
    return null;
  }
};

const create = async (data: Create<Module>Input): Promise<<Type> | null> => {
  patch({ loading: true, error: null });
  try {
    const item = await <Module>Service.create(data);
    patch({ items: [item, ...state.items], loading: false });
    return item;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Creation failed";
    patch({ error: message, loading: false });
    return null;
  }
};

const update = async (id: string, data: Update<Module>Input): Promise<<Type> | null> => {
  patch({ loading: true, error: null });
  try {
    const item = await <Module>Service.update(id, data);
    patch({ 
      items: state.items.map((i) => (i.userId === id ? item : i)),
      selectedItem: item,
      loading: false 
    });
    return item;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    patch({ error: message, loading: false });
    return null;
  }
};

const deleteItem = async (id: string): Promise<void> => {
  patch({ loading: true, error: null });
  try {
    await <Module>Service.delete(id);
    patch({ 
      items: state.items.filter((i) => i.userId !== id),
      loading: false 
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Deletion failed";
    patch({ error: message, loading: false });
  }
};

const setFilters = (filters: Partial<<Module>QueryParams>) => {
  patch({ filters: { ...state.filters, ...filters } });
};

const clearError = () => patch({ error: null });

/* ── selector & hook ──────────────────────────────────────────── */
const getSnapshot = () => state;
const getServerSnapshot = () => state;

export const use<Module>Store = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

/* ── typed action hooks ───────────────────────────────────────── */
export const use<Module>Actions = () => ({
  fetchList: useCallback(fetchList, []),
  fetchOne: useCallback(fetchOne, []),
  create: useCallback(create, []),
  update: useCallback(update, []),
  delete: useCallback(deleteItem, []),
  setFilters: useCallback(setFilters, []),
  clearError: useCallback(clearError, []),
});
```

### 5. Routes (`routes.tsx`)
```typescript
import * as React from "react";
import { useParams, useNavigate, type RouteObject } from "react-router-dom";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { <Module>List } from "@/modules/<module>/pages/<Module>List";
import { <Module>Details } from "@/modules/<module>/components/<Module>Details";
import { <Module>Form } from "@/modules/<module>/components/<Module>Form";

/**
 * <Module> Route Helpers
 */
export const <module>RoutesConfig = {
  list: () => "/<module>",
  create: () => "/<module>/new",
  details: (id: string) => `/<module>/${id}`,
  edit: (id: string) => `/<module>/${id}/edit`,
};

const <Module>DetailsRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (!id) return null;
  return <Module>Details id={id} onBack={() => navigate(<module>RoutesConfig.list())} />;
};

const <Module>FormRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return <Module>Form id={id} onCancel={() => navigate(<module>RoutesConfig.list())} />;
};

/**
 * <Module> Feature Routes
 */
export const <module>Routes: RouteObject[] = [
  {
    path: "<module>",
    element: <PermissionGuard permission="pages.<module>" />,
    children: [
      { index: true, element: <Module>List /> },
      { path: "new", element: <Module>FormRoute /> },
      { path: ":id/edit", element: <Module>FormRoute /> },
      { path: ":id", element: <Module>DetailsRoute /> },
    ],
  },
];
```

### 6. Main Index (`index.ts`)
```typescript
/**
 * <Module> Module Barrel Export
 * All <module>-related components, hooks, services and types.
 */

export * from "./api";
export * from "./services";
export * from "./store";
export * from "./hooks";
export * from "./pages";
export * from "./components";
export * from "./types";
export * from "./utils";
```

### 7. Register in Main Router (`frontend/src/router/routes.tsx`)
```typescript
import { <module>Routes } from "@/modules/<module>/routes";

// Add to protectedFeatureRoutes array
const protectedFeatureRoutes: RouteObject[] = [
  // ... existing routes
  ...<module>Routes,
];
```

## Key Patterns to Follow

### 1. API Layer Separation
- **Endpoints**: URL constants only (`endpoints.ts`)
- **API Class**: HTTP calls only (`api.ts`)
- **Service Class**: Business logic, error handling, response unwrapping (`service.ts`)

### 2. State Management with useSyncExternalStore
```typescript
// Module-level singleton (outside component)
let state: State = { ... };
const listeners = new Set<Listener>();

// Stable action references
const action = async () => { ... };

// Hook
export const useStore = () => useSyncExternalStore(subscribe, getSnapshot);
export const useActions = () => ({ action: useCallback(action, []) });
```

### 3. Permission Guards on Routes
```typescript
import { PermissionGuard } from "@/router/guards/PermissionGuard";

export const routes: RouteObject[] = [
  {
    path: "feature",
    element: <PermissionGuard permission="pages.feature" />,
    children: [...],
  },
];
```

### 4. Route Config Helpers
```typescript
export const featureRoutesConfig = {
  list: () => "/feature",
  create: () => "/feature/new",
  details: (id: string) => `/feature/${id}`,
  edit: (id: string) => `/feature/${id}/edit`,
};
```

### 5. Component Props Pattern
```typescript
interface ComponentProps {
  id?: string;
  onBack: () => void;
  onSubmit?: (data: FormData) => Promise<void>;
}
```

### 6. Form Handling
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema } from "@/modules/<module>/validations";

const form = useForm<CreateInput>({
  resolver: zodResolver(createSchema),
  defaultValues: { field: "" },
});
```

### 7. Data Fetching in Components
```typescript
const { fetchList, items, loading, error } = use<Module>Store();
const { fetchList: doFetch } = use<Module>Actions();

useEffect(() => {
  doFetch(filters);
}, [doFetch, filters]);
```

## Type Definitions

### Module Types (`types/index.ts`)
```typescript
import type { <Type> } from "@/lib/types";

export interface <Module>State {
  items: <Type>[];
  selectedItem: <Type> | null;
  filters: <Module>QueryParams;
  pagination: PaginationMeta;
  stats: StatsMeta;
  loading: boolean;
  error: string | null;
}

export interface Create<Module>Input {
  field: string;
}

export interface Update<Module>Input {
  field?: string;
}

export interface <Module>QueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
```

## Shared Code Patterns

### Core API (`@/core/api`)
```typescript
import { api } from "@/core/api";

// GET with params
api.get<User[]>("/users", { params: { page: 1, limit: 10 } });

// POST
api.post<User>("/users", { name: "John" });

// PUT
api.put<User>("/users/123", { name: "Jane" });

// DELETE
api.delete<void>("/users/123");
```

### Permission System
```typescript
import { PERMISSIONS } from "@/lib/permissions";
import { PermissionGuard } from "@/router/guards/PermissionGuard";
import { useHasPermission } from "@/modules/auth/hooks";

// In routes
<PermissionGuard permission={PERMISSIONS.PAGES_USERS}>

// In components
const { hasPermission } = useHasPermission();
if (hasPermission(PERMISSIONS.USERS_CREATE)) { ... }
```

### Shared UI Components
```typescript
import { Button, Input, Modal, Table, Card } from "@/shared/components";
import { cn } from "@/utils/cn";
```

### Layout
```typescript
import { AdminLayout } from "@/shared/layouts/AdminLayout";
import { AppProviders } from "@/shared/providers/AppProviders";
```

## Adding New Modules Checklist

1. [ ] Create folder structure under `frontend/src/modules/<module>/`
2. [ ] Create `api/`, `components/`, `hooks/`, `pages/`, `services/`, `store/`, `types/`, `utils/`
3. [ ] Create `endpoints.ts` with URL constants
4. [ ] Create `api.ts` with ApiClient wrapper
5. [ ] Create `service.ts` with business logic
6. [ ] Create `store.ts` with useSyncExternalStore
7. [ ] Create `routes.tsx` with PermissionGuard
8. [ ] Create page components (`List`, `Details`, `Form`)
9. [ ] Create reusable components
10. [ ] Define types in `types/`
11. [ ] Create `index.ts` barrel export
12. [ ] Register routes in `frontend/src/router/routes.tsx`
13. [ ] Add permission constants to `lib/permissions.ts` if needed
14. [ ] Update navigation in `modules/navigation/` if needed

## Common Mistakes to Avoid

1. ❌ Putting HTTP calls directly in components
2. ❌ Using useState/useContext for module state (use useSyncExternalStore)
3. ❌ Not unwrapping API responses in Service layer
4. ❌ Forgetting PermissionGuard on protected routes
5. ❌ Not exporting from module index.ts
6. ❌ Hardcoding URLs instead of using endpoints constants
7. ❌ Not handling loading/error states in UI
8. ❌ Using `any` type instead of proper TypeScript types
9. ❌ Forgetting to register routes in main router
10. ❌ Not aligning permission keys with backend

## Testing Checklist for New Modules
- [ ] Unit tests for services
- [ ] Component tests for pages/forms
- [ ] Store action tests
- [ ] Route guard tests
- [ ] Permission integration tests

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