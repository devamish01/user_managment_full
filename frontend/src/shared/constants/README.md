# Shared Constants

App-wide constant values.

Future contents:
- `permissions.ts` — permission key constants
  (e.g. `PERM.USERS_CREATE = "users.create"`) to replace magic strings
- `routes.ts` — route name constants
- `config.ts` — app-level configuration (page sizes, feature flags)

Rules:
- Constants only. No logic, no side effects.
