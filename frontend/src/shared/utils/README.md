# Shared Utils

Pure, side-effect-free functions.

Migration targets:
- `src/utils/cn.ts`          → class-name merger
- `src/lib/helpers.ts`       → formatDate, formatDateTime, timeAgo, statusColor
- `src/lib/permissions.ts`   → hasPermission, buildCurrentUserPermissions

Rules:
- Pure functions only. No React, no store, no fetch.
- Fully unit-testable in isolation.
