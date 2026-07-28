# Store Layer

Home for global state management.

## Current State

The active store lives in `src/lib/store.tsx` (Phase 2 — DO NOT MOVE YET).
It contains: StoreProvider (entities + actions), ThemeProvider, RouterProvider.

## Future Split (Phase 3.2+)

```
store/
    index.tsx          Root provider composing all slices
    auth.store.tsx     Session, currentUser, permissions
    users.store.tsx    Users entity + actions + pagination meta
    roles.store.tsx    Roles entity + actions
    permissions.store.tsx
    system.store.tsx   Logs, departments
    theme.store.tsx    Theme provider
```

## Rules

1. Store slices call Services only — never `api` directly, never mocks.
2. After every mutation, a slice re-fetches from its Service
   (the backend remains the single source of truth).
3. Pages consume store actions — pages never call Services directly
   for entity CRUD.
