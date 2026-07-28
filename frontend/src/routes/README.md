# Routes Layer

Home for routing definitions, guards and navigation config.

## Current State

Routing currently lives in `src/lib/store.tsx` (Phase 2 — DO NOT MOVE YET):
- `Route` union type
- `RouterProvider` / `useRouter`
- `ROUTE_PERMISSIONS` map
- `canAccessRoute()` guard

## Future Layout (Phase 3.2+)

```
routes/
    index.tsx          Route registry & RouteView switch
    guards.ts          canAccessRoute + permission gate component
    paths.ts           Route name constants
    types.ts           Route union type
```

## Rules

1. Every route maps to a permission key in `ROUTE_PERMISSIONS`.
2. Adding a module page = register route + permission here, nothing else.
3. Guards read permissions via the auth store — no hardcoded role IDs.
