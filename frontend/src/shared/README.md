# Shared Layer

Cross-cutting code used by **two or more modules**.

## Golden Rule

`shared/` must NEVER import from `modules/`.
Modules import from shared — never the reverse.
This keeps the dependency graph acyclic.

## Folders

| Folder        | Purpose                                                        |
|---------------|----------------------------------------------------------------|
| `components/` | Reusable UI primitives (Button, Card, Dialog, Table, Toast...) |
| `hooks/`      | Generic hooks (useDebounce, usePagination, useDisclosure...)   |
| `layouts/`    | App shells (Sidebar + Topbar layout, auth layout...)           |
| `utils/`      | Pure functions (formatters, cn, permission checker...)         |
| `constants/`  | App-wide constants (route keys, permission keys, config...)    |
| `types/`      | Global domain types shared across modules                      |

## Migration Sources (Phase 3.2+)

- `src/components/ui/*`      → `shared/components/`
- `src/components/layout/*`  → `shared/layouts/`
- `src/utils/cn.ts`          → `shared/utils/`
- `src/lib/helpers.ts`       → `shared/utils/`
- `src/lib/types.ts`         → `shared/types/`
- `src/lib/permissions.ts`   → `shared/utils/` (permission checker)

Do not move files yet — this happens in the migration phase.
