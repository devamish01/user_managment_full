# Shared Types

Global domain types used across multiple modules.

Migration target for `src/lib/types.ts`:
- `User`, `Role`, `Permission`, `Department`, `ActivityLog`, `Status`

API envelope types (`ApiResponse`, `Pagination`, ...) stay in `src/api/types.ts`
because they belong to the transport layer, not the domain layer.

Rules:
- Types and interfaces only. No runtime code.
