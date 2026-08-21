# Module Creation Guide - Complete Checklist

This guide provides a step-by-step checklist for creating new feature modules that follow the established patterns in this codebase.

## Quick Reference: Module Structure

### Backend Module
```
backend/src/modules/<module>/
├── constants/
│   ├── index.ts
│   └── messages.ts
├── controllers/
│   ├── index.ts
│   └── <action>.controller.ts
├── services/
│   ├── index.ts
│   └── <action>.service.ts
├── model/
│   ├── index.ts
│   └── <module>.type.ts
├── routes/
│   ├── index.ts
│   └── <module>.route.ts
├── types/
│   ├── index.ts
│   └── <type>.type.ts
├── utils/
│   ├── index.ts
│   └── <utility>.ts
├── validations/
│   ├── index.ts
│   └── <schema>.schema.ts
└── index.ts
```

### Frontend Module
```
frontend/src/modules/<module>/
├── api/
│   ├── <module>.endpoints.ts
│   ├── <module>.api.ts
│   └── index.ts
├── components/
│   ├── <Component>.tsx
│   └── index.ts
├── hooks/
│   ├── use<Feature>.ts
│   └── index.ts
├── pages/
│   ├── <Page>.tsx
│   └── index.ts
├── routes.tsx
├── services/
│   ├── <module>.service.ts
│   └── index.ts
├── store/
│   ├── <module>.store.ts
│   └── index.ts
├── types/
│   ├── index.ts
│   └── <type>.ts
├── utils/
│   ├── index.ts
│   └── <utility>.ts
├── shared/
│   ├── components/
│   ├── constants/
│   └── types/
└── index.ts
```

---

## Backend Module Creation Checklist

### Phase 1: Setup & Constants
- [ ] Create folder structure: `mkdir -p backend/src/modules/<module>/{constants,controllers,services,model,routes,types,utils,validations}`
- [ ] Create `constants/messages.ts` with `MODULE_MESSAGES` and `MODULE_ERRORS`
- [ ] Create `constants/index.ts` exporting messages
- [ ] Define all success/error messages as `const` objects with `as const`

### Phase 2: Model & Types
- [ ] Create `model/<module>.type.ts` with `I<Module>` interface extending `Document`
- [ ] Include `userId: string` as primary identifier (not `_id`)
- [ ] Include `createdAt: Date` and `updatedAt: Date`
- [ ] Create `model/index.ts` with Mongoose schema and model export
- [ ] Add indexes for frequently queried fields
- [ ] Create `types/index.ts` for request/response types if needed

### Phase 3: Validations
- [ ] Create `validations/create.schema.ts` with Zod schema for creation
- [ ] Create `validations/update.schema.ts` with Zod schema for updates
- [ ] Create `validations/query.schema.ts` for pagination/filtering
- [ ] Create `validations/param.schema.ts` for ID params
- [ ] Export types using `z.infer<typeof schema>`
- [ ] Create `validations/index.ts` barrel export

### Phase 4: Services
- [ ] Create `services/create.service.ts` - creation logic
- [ ] Create `services/get.service.ts` - list (with pagination) and get by ID
- [ ] Create `services/update.service.ts` - update logic
- [ ] Create `services/delete.service.ts` - deletion logic
- [ ] Use `AppError` for all operational errors
- [ ] Import constants from `@/modules/<module>/constants`
- [ ] Import HTTP_STATUS from `@/shared/constants/http-status`
- [ ] Create `services/index.ts` barrel export

### Phase 5: Controllers
- [ ] Create `controllers/list.controller.ts` - GET all with pagination
- [ ] Create `controllers/get.controller.ts` - GET by ID
- [ ] Create `controllers/create.controller.ts` - POST create
- [ ] Create `controllers/update.controller.ts` - PUT/PATCH update
- [ ] Create `controllers/delete.controller.ts` - DELETE
- [ ] Use `asyncHandler` wrapper on ALL controllers
- [ ] Use `successResponse` / `createdResponse` from `@/shared/response`
- [ ] Type request as `AuthRequest` for authenticated routes
- [ ] Create `controllers/index.ts` barrel export

### Phase 6: Routes
- [ ] Create `routes/<module>.route.ts` with Express Router
- [ ] Apply `authMiddleware` to all routes (or specific ones)
- [ ] Apply `validate({ body: schema })` for POST/PUT/PATCH
- [ ] Apply `validate({ query: schema })` for GET with query params
- [ ] Apply `validate({ params: schema })` for routes with params
- [ ] Export as `<module>Routes`
- [ ] Create `routes/index.ts` barrel export

### Phase 7: Main Index & Registration
- [ ] Create `index.ts` with all barrel exports
- [ ] Register routes in `backend/src/routes/index.ts`
- [ ] Import: `import { <module>Routes } from "@/modules/<module>/routes/index.js";`
- [ ] Add: `routes.use("/<module>", <module>Routes);`

### Phase 8: Verification
- [ ] Run TypeScript compilation: `npm run build` (or `tsc --noEmit`)
- [ ] Test endpoints with curl/Postman
- [ ] Verify error handling works correctly
- [ ] Check pagination response format matches standard

---

## Frontend Module Creation Checklist

### Phase 1: Setup & Endpoints
- [ ] Create folder structure: `mkdir -p frontend/src/modules/<module>/{api,components,hooks,pages,services,store,types,utils,shared/{components,constants,types}}`
- [ ] Create `api/<module>.endpoints.ts` with URL constants
- [ ] Use template literal functions for dynamic routes: `DETAILS = (id) => \`/module/${id}\``
- [ ] Create `api/index.ts` barrel export

### Phase 2: API Layer
- [ ] Create `api/<module>.api.ts` with `<Module>Api` class
- [ ] Static methods for: list, get, create, update, delete
- [ ] Use `api` from `@/core/api`
- [ ] Return `Promise<ApiResponse<T>>` from all methods
- [ ] Import endpoints from `./<module>.endpoints`
- [ ] Create `api/index.ts` barrel export

### Phase 3: Service Layer
- [ ] Create `services/<module>.service.ts` with `<Module>Service` class
- [ ] Static methods that call `<Module>Api` and unwrap responses
- [ ] Throw `Error` with message if `!res.success`
- [ ] Return unwrapped data (`res.data`)
- [ ] Create `services/index.ts` barrel export

### Phase 4: Types
- [ ] Create `types/index.ts` with:
  - `<Module>State` interface (items, selectedItem, filters, pagination, stats, loading, error)
  - `Create<Module>Input` interface
  - `Update<Module>Input` interface
  - `<Module>QueryParams` interface
- [ ] Import shared types from `@/lib/types` when applicable

### Phase 5: Store (useSyncExternalStore)
- [ ] Create `store/<module>.store.ts` with:
  - Module-level singleton `state` object
  - `listeners` Set and `subscribe`/`emit` functions
  - `patch` function for state updates
  - Stable action functions (fetchList, fetchOne, create, update, delete, setFilters, clearError)
  - `getSnapshot` and `getServerSnapshot`
  - `use<Module>Store` hook using `useSyncExternalStore`
  - `use<Module>Actions` hook with `useCallback` wrapped actions
- [ ] Create `store/index.ts` barrel export

### Phase 6: Components
- [ ] Create `pages/<Module>List.tsx` - list page with table, pagination, search, filters
- [ ] Create `components/<Module>Details.tsx` - detail view
- [ ] Create `components/<Module>Form.tsx` - create/edit form
- [ ] Use `react-hook-form` with `zodResolver` for forms
- [ ] Import validation schemas from backend (or duplicate in frontend types)
- [ ] Create `components/index.ts` and `pages/index.ts` barrel exports

### Phase 7: Hooks
- [ ] Create `hooks/use<Module>.ts` for any custom hooks
- [ ] Common: `use<Module>Filters`, `use<Module>Actions`, `use<Module>Selection`
- [ ] Create `hooks/index.ts` barrel export

### Phase 8: Routes
- [ ] Create `routes.tsx` with:
  - Route config helper object (`list()`, `create()`, `details(id)`, `edit(id)`)
  - Route components for details and form (using `useParams`, `useNavigate`)
  - `RouteObject[]` export with `PermissionGuard`
  - Permission key from `@/lib/permissions`
- [ ] Export as `<module>Routes`

### Phase 9: Main Index & Registration
- [ ] Create `index.ts` with all barrel exports
- [ ] Register in `frontend/src/router/routes.tsx`:
  - Import: `import { <module>Routes } from "@/modules/<module>/routes";`
  - Add to `protectedFeatureRoutes` array: `...<module>Routes,`

### Phase 10: Permissions & Navigation
- [ ] Add permission keys to `frontend/src/lib/permissions.ts` if new
- [ ] Update navigation in `frontend/src/modules/navigation/` if module should appear in sidebar
- [ ] Ensure permission keys match backend exactly

### Phase 11: Verification
- [ ] Run TypeScript: `npm run build` or `tsc --noEmit`
- [ ] Run lint: `npm run lint`
- [ ] Test in browser: navigate to route, verify list/create/edit/delete
- [ ] Verify permission guard works (test with/without permission)
- [ ] Check loading/error states display correctly
- [ ] Verify pagination and search work

---

## Shared Patterns Reference

### Backend Response Format
```typescript
// Success
{
  success: true,
  status: 200,
  message: "Success message",
  data: T,
  meta: { pagination, stats },
  errors: null
}

// Created
{
  success: true,
  status: 201,
  message: "Created message",
  data: T,
  meta: {},
  errors: null
}

// Error
{
  success: false,
  status: 400,
  message: "Error message",
  data: null,
  meta: {},
  errors: [...]
}
```

### Frontend ApiResponse Type
```typescript
interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
  meta: ApiResponseMeta;
  errors: ApiError[] | null;
}
```

### Pagination Meta
```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

### Standard Query Params
```typescript
interface QueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
```

---

## Common Commands

### Backend
```bash
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Frontend
```bash
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix lint issues
```

---

## Naming Conventions Summary

| Item | Convention | Example |
|------|------------|---------|
| Module folder | kebab-case | `user-management` |
| Files | kebab-case | `user.controller.ts` |
| Classes | PascalCase | `UserService` |
| Functions/Variables | camelCase | `getUsers` |
| Constants | UPPER_SNAKE_CASE | `USER_MESSAGES` |
| Types/Interfaces | PascalCase | `User`, `CreateUserInput` |
| Route exports | camelCase + Routes | `userRoutes` |
| Store hooks | use + PascalCase | `useUserStore` |
| Action hooks | use + PascalCase + Actions | `useUserActions` |

---

## Permission Keys Template

Add to `frontend/src/lib/permissions.ts`:
```typescript
export const PERMISSIONS = {
  // ... existing
  
  // <Module>
  <MODULE>_VIEW: "<module>.view",
  <MODULE>_CREATE: "<module>.create",
  <MODULE>_EDIT: "<module>.edit",
  <MODULE>_DELETE: "<module>.delete",
  
  // Pages
  PAGES_<MODULE>: "pages.<module>",
} as const;
```

Add to backend permission seeder/registry accordingly.

---

## Quick Start: Copy-Paste Templates

### Backend: Minimal Module (5 files)
1. `constants/messages.ts` - Messages
2. `model/index.ts` - Mongoose model
3. `validations/index.ts` - Zod schemas
4. `services/index.ts` - Business logic
5. `controllers/index.ts` - HTTP handlers
6. `routes/<module>.route.ts` - Express routes
7. `index.ts` - Barrel export
8. Register in `backend/src/routes/index.ts`

### Frontend: Minimal Module (6 files)
1. `api/<module>.endpoints.ts` - URLs
2. `api/<module>.api.ts` - HTTP calls
3. `services/<module>.service.ts` - Business logic
4. `store/<module>.store.ts` - State management
5. `routes.tsx` - Route definitions
6. `index.ts` - Barrel export
7. Register in `frontend/src/router/routes.tsx`

---

## Review Checklist Before Committing

### Code Quality
- [ ] No `any` types (use proper generics)
- [ ] All async functions use `asyncHandler` (backend) or try/catch (frontend)
- [ ] All errors use `AppError` (backend) or thrown Errors with messages (frontend)
- [ ] All responses use standardized helpers
- [ ] All routes have validation middleware
- [ ] All protected routes have auth middleware

### Consistency
- [ ] Follows existing module patterns exactly
- [ ] Barrel exports in every index.ts
- [ ] Import aliases used correctly (`@/`)
- [ ] Naming conventions followed
- [ ] Permission keys match backend

### Functionality
- [ ] CRUD operations work end-to-end
- [ ] Pagination works correctly
- [ ] Search/filter works
- [ ] Error states handled in UI
- [ ] Loading states shown
- [ ] Permission guards work

### Documentation
- [ ] Module README.md created (optional but recommended)
- [ ] Complex logic commented
- [ ] Types exported for external use

---

## Troubleshooting Common Issues

### Backend
| Issue | Solution |
|-------|----------|
| "Cannot find module" | Check barrel exports in index.ts, verify import paths |
| Validation not working | Ensure validate middleware applied, schema exported |
| Auth middleware error | Import from `@/shared/middlewares/index.js`, use `authMiddleware` |
| Route not found | Register in `backend/src/routes/index.ts` |
| TypeScript errors | Run `tsc --noEmit`, check import extensions (.js) |

### Frontend
| Issue | Solution |
|-------|----------|
| Store not updating | Check `emit()` called in `patch()`, actions use `useCallback` |
| Permission guard not working | Verify permission key in `lib/permissions.ts`, check auth store |
| Route not rendering | Register in `router/routes.tsx`, check path matching |
| API 404 | Check endpoint URL matches backend, verify API_BASE_URL |
| Type errors | Run `tsc --noEmit`, check barrel exports |

---

**Remember**: The goal is consistency. When in doubt, look at existing modules (auth, users, roles, permissions) and follow their patterns exactly.