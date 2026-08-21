# Instruction Files Overview

This project includes four comprehensive instruction files to ensure consistent development patterns across the codebase.

## File Structure

```
user_managmnet_full/
├── .copilot-instructions.md      # Main entry point - references all others
├── BACKEND_INSTRUCTIONS.md       # Backend-specific patterns & templates
├── FRONTEND_INSTRUCTIONS.md      # Frontend-specific patterns & templates
├── SHARED_INSTRUCTIONS.md        # Cross-cutting patterns (both sides)
├── MODULE_CREATION_GUIDE.md      # Step-by-step module creation checklist
├── IMPLEMENTED_FEATURES.md       # Track implemented features
├── ALIGNMENT_GUIDE.md            # Frontend-backend alignment
├── ROADMAP.md                    # Project roadmap
└── README.md                     # Project overview
```

---

## How to Use These Instructions

### For AI Assistants (GitHub Copilot, etc.)

When working on this project, **always reference these instruction files** before writing code:

1. **Start with `.copilot-instructions.md`** - It provides the high-level architecture overview
2. **Use `BACKEND_INSTRUCTIONS.md`** for any backend work (controllers, services, models, routes)
3. **Use `FRONTEND_INSTRUCTIONS.md`** for any frontend work (components, stores, API, routes)
4. **Use `SHARED_INSTRUCTIONS.md`** for patterns that apply to both (TypeScript, errors, auth, validation)
5. **Use `MODULE_CREATION_GUIDE.md`** when creating new feature modules

### For Human Developers

These files serve as:
- **Onboarding guide** - New team members can understand patterns quickly
- **Reference during development** - Check patterns before implementing
- **Code review checklist** - Ensure consistency in PRs
- **Template source** - Copy-paste boilerplate for new modules

---

## Quick Decision Matrix

| Task | Primary Reference | Secondary Reference |
|------|-------------------|---------------------|
| Create new backend module | `BACKEND_INSTRUCTIONS.md` | `MODULE_CREATION_GUIDE.md` |
| Create new frontend module | `FRONTEND_INSTRUCTIONS.md` | `MODULE_CREATION_GUIDE.md` |
| Add API endpoint | `BACKEND_INSTRUCTIONS.md` (routes) | `FRONTEND_INSTRUCTIONS.md` (API layer) |
| Implement authentication | `SHARED_INSTRUCTIONS.md` (auth) | `BACKEND_INSTRUCTIONS.md` / `FRONTEND_INSTRUCTIONS.md` |
| Add validation | `SHARED_INSTRUCTIONS.md` (validation) | `BACKEND_INSTRUCTIONS.md` / `FRONTEND_INSTRUCTIONS.md` |
| Handle errors | `SHARED_INSTRUCTIONS.md` (errors) | `BACKEND_INSTRUCTIONS.md` / `FRONTEND_INSTRUCTIONS.md` |
| State management | `FRONTEND_INSTRUCTIONS.md` (store) | `SHARED_INSTRUCTIONS.md` (patterns) |
| Database operations | `BACKEND_INSTRUCTIONS.md` (services) | `SHARED_INSTRUCTIONS.md` (DB patterns) |
| Routing | `BACKEND_INSTRUCTIONS.md` / `FRONTEND_INSTRUCTIONS.md` | `SHARED_INSTRUCTIONS.md` |
| Permissions | `SHARED_INSTRUCTIONS.md` (permissions) | `FRONTEND_INSTRUCTIONS.md` (guards) |

---

## Key Principles Enforced

### 1. Module-Based Architecture
- Every feature is a self-contained module
- Clear separation: constants, controllers, services, model, routes, types, validations
- Barrel exports (`index.ts`) in every folder

### 2. Layer Separation
- **Backend**: Controllers (HTTP) → Services (Business Logic) → Model (Data)
- **Frontend**: Components (UI) → Store (State) → Services (Logic) → API (HTTP)

### 3. Standardized Patterns
- Error handling: `AppError` (backend) / thrown Errors (frontend)
- Responses: `successResponse` / `createdResponse` / `errorResponse`
- Validation: Zod schemas + middleware
- Auth: JWT + middleware + permission guards

### 4. Type Safety
- Strict TypeScript everywhere
- No `any` types
- Shared types in `@/lib/types` (frontend) / module types (backend)
- Zod inference for validation types

### 5. Consistency Over Preference
- Follow existing module patterns exactly (auth, users, roles, permissions)
- Use established naming conventions
- Maintain frontend-backend alignment

---

## Verification Checklist

Before considering any task complete, verify:

### Backend
- [ ] Module follows folder structure
- [ ] All files have barrel exports
- [ ] Controllers use `asyncHandler`
- [ ] Responses use standardized helpers
- [ ] Errors use `AppError`
- [ ] Validation middleware applied
- [ ] Auth middleware on protected routes
- [ ] Routes registered in main router
- [ ] TypeScript compiles
- [ ] Tests pass

### Frontend
- [ ] Module follows folder structure
- [ ] All files have barrel exports
- [ ] API layer: endpoints → api → service
- [ ] Store uses `useSyncExternalStore`
- [ ] Routes use `PermissionGuard`
- [ ] Components handle loading/error states
- [ ] Permission keys match backend
- [ ] Routes registered in main router
- [ ] TypeScript compiles
- [ ] Lint passes
- [ ] Tests pass

### Cross-Cutting
- [ ] Import aliases used correctly
- [ ] Naming conventions followed
- [ ] No console.log in production code
- [ ] Environment variables for config
- [ ] Documentation updated if needed

---

## Updating Instructions

When you discover a pattern that should be standardized:

1. **Add to appropriate instruction file**
2. **Update `MODULE_CREATION_GUIDE.md`** if it affects module creation
3. **Update `ALIGNMENT_GUIDE.md`** if it affects frontend-backend alignment
4. **Reference in PR description** so reviewers know about the new standard

---

## Example: Creating a New "Products" Module

### Backend (follow `BACKEND_INSTRUCTIONS.md` + `MODULE_CREATION_GUIDE.md`)
```bash
# 1. Create structure
mkdir -p backend/src/modules/products/{constants,controllers,services,model,routes,types,utils,validations}

# 2. Create files following templates in BACKEND_INSTRUCTIONS.md
# 3. Register in backend/src/routes/index.ts
```

### Frontend (follow `FRONTEND_INSTRUCTIONS.md` + `MODULE_CREATION_GUIDE.md`)
```bash
# 1. Create structure
mkdir -p frontend/src/modules/products/{api,components,hooks,pages,services,store,types,utils,shared/{components,constants,types}}

# 2. Create files following templates in FRONTEND_INSTRUCTIONS.md
# 3. Register in frontend/src/router/routes.tsx
# 4. Add permissions to frontend/src/lib/permissions.ts
```

### Shared Concerns (follow `SHARED_INSTRUCTIONS.md`)
- TypeScript config
- Error handling patterns
- Validation patterns
- Auth/permission patterns
- Database patterns
- State management patterns

---

## Related Documentation

| File | Purpose |
|------|---------|
| `IMPLEMENTED_FEATURES.md` | Track what's been built |
| `ALIGNMENT_GUIDE.md` | Frontend-backend contract |
| `ROADMAP.md` | Future work planned |
| `README.md` | Project overview & setup |

---

**Remember**: These instructions are living documents. Update them as the project evolves to keep them relevant and useful.