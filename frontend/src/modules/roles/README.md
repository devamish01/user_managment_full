# Roles Module

Owns the **role management & assignment** domain.

## Will contain (after migration in Phase 3.2+)

- `pages/` — RoleAssignment
- `components/` — role cards, permission matrix, module perms card
- `hooks/` — useRoles
- `types.ts` — Role-specific view types
- `index.ts` — public exports

## Related (kept outside the module)

- Service: `src/services/role.service.ts`
- API routes: `src/api/endpoints.ts` → `API.ROLES`
- Mock seed: `src/mocks/roles.ts`

Do not add code here until the migration phase.
