# Modules (Feature-Sliced Architecture)

Each folder here represents a **business domain** of the Admin Panel.

## Structure Convention

Every module follows the same internal layout (added progressively as code migrates):

```
modules/<name>/
    pages/          Page-level components for this domain
    components/     Components used ONLY by this module
    hooks/          Hooks used ONLY by this module
    types.ts        Domain types (re-exported from shared if global)
    index.ts        Public API of the module (barrel)
```

## Rules

1. A module may import from `shared/`, `api/`, `store/`, and `services/`.
2. A module must NEVER import from another module directly.
   Cross-module needs go through `shared/` or the store.
3. Everything a module exposes to the outside goes through its `index.ts`.

## Current Modules

| Module        | Domain                                    |
|---------------|-------------------------------------------|
| `users/`      | User management (list, details, forms)    |
| `roles/`      | Role management & role assignment         |
| `permissions/`| Permission definitions & UI visibility    |

## Planned Modules (do not create yet)

- `payments/`
- `events/`
- `comments/`

These will be added in later phases following the same convention.
