# Users Module

Owns the **user management** domain.

## Will contain (after migration in Phase 3.2+)

- `pages/` — UserList, UserDetails, UserForm
- `components/` — user table, stat cards, user form modal
- `hooks/` — useUsers, useUserFilters
- `types.ts` — User-specific view types
- `index.ts` — public exports

## Related (kept outside the module)

- Service: `src/services/user.service.ts`
- API routes: `src/api/endpoints.ts` → `API.USERS`
- Mock seed: `src/mocks/users.ts`

Do not add code here until the migration phase.
