# Shared Hooks

Generic, reusable hooks that contain no domain knowledge.

Future examples:
- `useDebounce` — debounced values for server-side search inputs
- `usePagination` — page/limit state helper bound to API meta
- `useDisclosure` — open/close state for dialogs & drawers
- `useClickOutside` — used by Dropdown/Select primitives

Rules:
- No module imports.
- No domain types (User, Role, ...) — keep them generic.
