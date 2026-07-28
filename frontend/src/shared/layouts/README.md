# Shared Layouts

Application shells that frame pages.

Migration target for `src/components/layout/AppLayout.tsx`
(Sidebar + Topbar + content area).

Future layouts:
- `AppLayout` — authenticated admin shell
- `AuthLayout` — login / forgot-password shell (when real auth arrives)

Rules:
- Layouts may read the store (for nav permissions, current user).
- Layouts must not contain page business logic.
