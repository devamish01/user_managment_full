# Permissions Module

Owns the **permission definitions & UI visibility** domain.

## Will contain (after migration in Phase 3.2+)

- `pages/` — Permissions
- `components/` — module cards, permission item, tabbed groups
- `hooks/` — usePermissions
- `types.ts` — Permission-specific view types
- `index.ts` — public exports

## Related (kept outside the module)

- Service: `src/services/permission.service.ts`
- Permission checker utility: `src/lib/permissions.ts`
  (will move to `shared/utils/` or stay domain-global — decided at migration)
- API routes: `src/api/endpoints.ts` → `API.PERMISSIONS`
- Mock seed: `src/mocks/permissions.ts`

Do not add code here until the migration phase.
