import type {
  ApiError,
  ApiResponse,
  HttpMethod,
  HttpStatus,
  Pagination,
} from "@/core/api";
import {
  successResponse,
  createdResponse,
  notFoundError,
  serverError,
  badRequestError,
  conflictError,
  validationError,
  paginationMeta,
  buildResponse,
} from "@/core/api";

import { mockAuth, superAdminPassword } from "@/mocks/auth";
import { getToken, removeToken } from "@/core/auth/token";
import type { User, Role, Permission, ActivityLog } from "@/lib/types";
import type { PaymentRecord } from "@/modules/payments/types";
import { db } from "./db";

/**
 * Decode a mock bearer token back to its userId.
 * Mock tokens are issued as `mock-token-${userId}-${ts}` (e.g. mock-token-USR-00002-1710000000000)
 * so a page refresh can restore the in-memory session from localStorage.
 * userId itself contains a hyphen (USR-00002), so we must capture greedily up to the last -<timestamp>.
 */
const parseMockToken = (token: string | null): string | null => {
  if (!token) return null;
  const m = /^mock-token-(.+)-(\d+)$/.exec(token);
  return m ? m[1] : null;
};

/**
 * Restore the in-memory session from the bearer token.
 * This is the ONLY source of truth on refresh — mockAuth.currentUserId is NOT trusted by itself.
 */
const restoreSessionFromToken = (): boolean => {
  const token = getToken();
  const tokenUserId = parseMockToken(token);

  if (!token || !tokenUserId) {
    // No valid token => no session. Clear any stale in-memory user.
    mockAuth.currentUserId = "";
    if (!token) return false;
    // Token present but unparsable => treat as invalid
    removeToken();
    return false;
  }

  const user = db.users.find((u) => u.id === tokenUserId);
  if (!user) {
    removeToken();
    mockAuth.currentUserId = "";
    return false;
  }

  // Valid token => restore session
  mockAuth.currentUserId = user.id;
  mockAuth.accessToken = token;
  if (!mockAuth.loginAt) mockAuth.loginAt = new Date().toISOString();
  if (!mockAuth.expiresAt)
    mockAuth.expiresAt = new Date(Date.now() + 3600000).toISOString();
  return true;
};

/* ==========================================================
 * Mock HTTP Client
 * Behaves like a real REST backend on top of mock data.
 * Supports: pagination, search, filter, sort, validation,
 * proper HTTP status codes and network latency simulation.
 *
 * Part of the core mock-backend infrastructure.
 * ========================================================== */

type PathParams = Record<string, string>;
type QueryParams = Record<string, string>;

interface MockRequest {
  url: string;
  method: HttpMethod;
  body?: unknown;
  pathParams: PathParams;
  queryParams: QueryParams;
}

/* Handler returns either a raw payload (wrapped as 200) or a pre-built ApiResponse. */
type MockHandler = (req: MockRequest) => unknown | Promise<unknown>;

interface RegisteredRoute {
  method: HttpMethod;
  pattern: RegExp;
  keys: string[];
  handler: MockHandler;
}

/* ── Utils ───────────────────────────────────────────── */

const simulateNetworkDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 150 + Math.random() * 350));

const isApiResponse = (v: unknown): v is ApiResponse<unknown> =>
  !!v &&
  typeof v === "object" &&
  "success" in (v as object) &&
  "status" in (v as object);

/* ── Query helpers (pagination / filter / sort / search) ── */

interface ListOptions<T> {
  /** Fields to run text search against. */
  searchFields?: (keyof T)[];
  /** Allowed filter keys. Values are compared for equality. */
  filterFields?: (keyof T)[];
  /** Allowed sort keys. */
  sortFields?: (keyof T)[];
}

const parseIntOr = (v: string | undefined, fallback: number) => {
  if (!v) return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

function applyListQuery<T extends object>(
  items: T[],
  query: QueryParams,
  opts: ListOptions<T>,
): { rows: T[]; pagination: Pagination } {
  let rows = [...items];

  /* ── Search  */
  const search = (query.search || query.q || "")
    .toString()
    .trim()
    .toLowerCase();
  if (search && opts.searchFields?.length) {
    rows = rows.filter((row) =>
      opts.searchFields!.some((f) => {
        const v = (row as Record<string, unknown>)[f as string];
        return typeof v === "string" && v.toLowerCase().includes(search);
      }),
    );
  }

  /* ── Filter ── */
  if (opts.filterFields?.length) {
    opts.filterFields.forEach((f) => {
      const key = String(f);
      const value = query[key];
      if (value !== undefined && value !== "" && value !== "all") {
        rows = rows.filter(
          (row) => String((row as Record<string, unknown>)[key]) === value,
        );
      }
    });
  }

  /* ── Sort ─ */
  const sort = query.sort as string | undefined;
  const order = (query.order as string | undefined) === "desc" ? "desc" : "asc";
  if (sort && opts.sortFields?.map(String).includes(sort)) {
    const dir = order === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort];
      const bv = (b as Record<string, unknown>)[sort];
      if (av == null && bv == null) return 0;
      if (av == null) return -1 * dir;
      if (bv == null) return 1 * dir;
      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }

  /* ── Pagination ─ */
  const total = rows.length;
  const hasPagination = query.page !== undefined || query.limit !== undefined;
  const page = parseIntOr(query.page, 1);
  const limit = parseIntOr(query.limit, hasPagination ? 20 : total || 1);
  const start = (page - 1) * limit;
  const paged = hasPagination ? rows.slice(start, start + limit) : rows;

  return {
    rows: paged,
    pagination: paginationMeta(page, hasPagination ? limit : total, total),
  };
}

/* ── Client ────────────────────────────────────────────── */

class MockClient {
  private routes: RegisteredRoute[] = [];

  register(method: HttpMethod, path: string, handler: MockHandler) {
    const keys: string[] = [];
    const pattern = new RegExp(
      "^" +
        path.replace(/:(\w+)/g, (_, key) => {
          keys.push(key);
          return "([^/]+)";
        }) +
        "$",
    );
    this.routes.push({ method, pattern, keys, handler });
  }

  private parseUrl(url: string): { path: string; queryParams: QueryParams } {
    const [path, query = ""] = url.split("?");
    const queryParams: QueryParams = {};
    if (query) {
      new URLSearchParams(query).forEach((v, k) => {
        queryParams[k] = v;
      });
    }
    return { path, queryParams };
  }

  async request<T>(
    method: HttpMethod,
    url: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    await simulateNetworkDelay();
    const { path, queryParams } = this.parseUrl(url);

    const route = this.routes.find(
      (r) => r.method === method && r.pattern.test(path),
    );

    if (!route) {
      return notFoundError(`Route ${method} ${url}`) as ApiResponse<T>;
    }

    const match = path.match(route.pattern)!;
    const pathParams: PathParams = {};
    route.keys.forEach((k, i) => {
      pathParams[k] = decodeURIComponent(match[i + 1]);
    });

    try {
      const result = await route.handler({
        url,
        method,
        body,
        pathParams,
        queryParams,
      });

      /* Handler may return a full ApiResponse (errors, pagination, etc.) or raw data */
      if (isApiResponse(result)) return result as ApiResponse<T>;

      /* Default success wrapping */
      const status: HttpStatus = method === "POST" ? 201 : 200;
      const defaultMessage =
        method === "POST"
          ? "Created successfully"
          : method === "PUT" || method === "PATCH"
            ? "Updated successfully"
            : method === "DELETE"
              ? "Deleted successfully"
              : "OK";
      return status === 201
        ? (createdResponse(result as T, defaultMessage) as ApiResponse<T>)
        : (successResponse(result as T, defaultMessage) as ApiResponse<T>);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown server error";
      return serverError(message) as ApiResponse<T>;
    }
  }
}

const mockClient = new MockClient();

/* ==========================================================
 * Validation helpers
 * ========================================================== */

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const requireFields = <T extends object>(
  body: T | undefined,
  fields: (keyof T)[],
): ApiError[] => {
  const errors: ApiError[] = [];
  if (!body) {
    fields.forEach((f) =>
      errors.push({
        code: "REQUIRED",
        field: String(f),
        message: `${String(f)} is required`,
      }),
    );
    return errors;
  }
  fields.forEach((f) => {
    const v = body[f];
    if (v === undefined || v === null || (typeof v === "string" && !v.trim())) {
      errors.push({
        code: "REQUIRED",
        field: String(f),
        message: `${String(f)} is required`,
      });
    }
  });
  return errors;
};

/* ==========================================================
 * Route Registration
 * Emulates REST endpoints on top of mock data.
 * ========================================================== */

/* ─────────────── AUTH / SESSION ─────────────── */

mockClient.register("GET", "/auth/session", async () => {
  if (!restoreSessionFromToken()) {
    return buildResponse(false, 401, null, "Not authenticated", {}, [
      { code: "UNAUTHORIZED", message: "No active session" },
    ]);
  }
  return successResponse({ ...mockAuth }, "Session retrieved");
});

mockClient.register("GET", "/auth/me", async () => {
  if (!restoreSessionFromToken()) {
    return buildResponse(false, 401, null, "Not authenticated", {}, [
      { code: "UNAUTHORIZED", message: "No active session" },
    ]);
  }

  const user = db.users.find((u) => u.id === mockAuth.currentUserId);

  if (!user) {
    return notFoundError("Current user");
  }
  return successResponse(
    {
      userId: user.id,
      username: user.username,

      firstName: user.firstName,
      lastName: user.lastName,

      email: user.email,

      role: user.role,
      status: user.status.toLowerCase(),
      roleId: user.roleId,

      approvedAt: user.approvedAt,
      approvedBy: user.approvedBy,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    "User fetched successfully",
  );
});

/* Email + password login. Credentials are validated against db.users.
 * Tokens encode the user id so the in-memory session can be restored from
 * localStorage after a page refresh. */
mockClient.register("POST", "/auth/login", async ({ body }) => {
  const payload = (body || {}) as {
    email?: string;
    password?: string;
  };

  if (!payload.email || !payload.password) {
    return validationError([
      { code: "REQUIRED", field: "email", message: "Email is required" },
      { code: "REQUIRED", field: "password", message: "Password is required" },
    ]);
  }

  const email = payload.email.trim().toLowerCase();

  const user = db.users.find(
    (u) => u.email.toLowerCase() === email
  );

  if (!user) {
    return buildResponse(
      false,
      401,
      null,
      "Invalid email or password",
      {},
      [
        {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      ]
    );
  }

  if (user.password !== payload.password) {
    return buildResponse(
      false,
      401,
      null,
      "Invalid email or password",
      {},
      [
        {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      ]
    );
  }


  // create mock session
  mockAuth.accessToken = `mock-token-${user.id}-${Date.now()}`;
  mockAuth.refreshToken = `mock-refresh-${user.id}-${Date.now()}`;
  mockAuth.currentUserId = user.id;
  mockAuth.rememberMe = true;
  mockAuth.loginAt = new Date().toISOString();
  mockAuth.expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();


  return successResponse(
    {
      session: {
        accessToken: mockAuth.accessToken,
        refreshToken: mockAuth.refreshToken,
        currentUserId: mockAuth.currentUserId,
        rememberMe: mockAuth.rememberMe,
        loginAt: mockAuth.loginAt,
        expiresAt: mockAuth.expiresAt,
      },
      user: {
        userId: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
        role: user.role,
        status: user.status.toLowerCase(),
        approvedAt: user.approvedAt,
        approvedBy: user.approvedBy,
        phone: user.phone,
        location: user.location,
        address: user.address,
        bio: user.bio,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
    "Login successful."
  );
});

mockClient.register("POST", "/auth/register", async ({ body }) => {
  const payload = (body || {}) as {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    roleId?: string;
    status?: "active" | "inactive" | "blocked" | "pending";
  };

  const required: ("username" | "firstName" | "lastName" | "email" | "password")[] = ["username", "firstName", "lastName", "email", "password"];
  const errs = requireFields(payload, required);
  if (errs.length) return validationError(errs);

  // Password validation - must be at least 8 characters
  if (payload.password!.length < 8) {
    return validationError([
      {
        code: "TOO_SHORT",
        field: "password",
        message: "Password must be at least 8 characters",
      },
    ]);
  }

  const email = payload.email!.trim().toLowerCase();
  const username = payload.username!.trim().toLowerCase();

  if (db.users.some((u) => u.email.toLowerCase() === email)) {
    return conflictError("A user with this email already exists", "email");
  }
  if (db.users.some((u) => u.username.toLowerCase() === username)) {
    return conflictError("A user with this username already exists", "username");
  }

  const nextIdNum =
    Math.max(
      0,
      ...db.users.map((u) => parseInt(u.id.replace(/\D/g, ""), 10) || 0),
    ) + 1;

  // Map roleId to role name (matching backend logic)
  const roleId = payload.roleId || "r4";
  const roleMap: Record<string, string> = {
    "r1": "super_admin",
    "r2": "admin",
    "r3": "manager",
    "r4": "viewer",
  };
  const role = roleMap[roleId] || "viewer";

  // Normalize status (matching backend logic)
  const status = (payload.status || "pending") as "active" | "inactive" | "blocked" | "pending";

  const newUser = {
    id: `USR-${String(nextIdNum).padStart(5, "0")}`,
    username: payload.username!.trim(),
    firstName: payload.firstName!.trim(),
    lastName: payload.lastName!.trim(),
    name: `${payload.firstName!.trim()} ${payload.lastName!.trim()}`,
    email: email,
    password: payload.password!,
    phone: "",
    roleId,
    role,
    status,
    location: "",
    address: "",
    bio: "",
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    approvedAt: status === "pending" ? null : new Date().toISOString(),
    approvedBy: status === "pending" ? null : "SYSTEM",
  } as User;

  db.users.unshift(newUser);

  return createdResponse(
    {
      userId: newUser.id,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      roleId: newUser.roleId,
      role: newUser.role,
      status: newUser.status,
      approvedAt: newUser.approvedAt,
      approvedBy: newUser.approvedBy,
      phone: newUser.phone,
      location: newUser.location,
      address: newUser.address,
      bio: newUser.bio,
      lastActive: newUser.lastActive,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    },
    "User registered successfully"
  );
});

mockClient.register("POST", "/auth/logout", async () => {
  mockAuth.currentUserId = "";
  mockAuth.accessToken = "";
  mockAuth.refreshToken = "";
  // Belt-and-braces: also clear the persisted token so a subsequent
  // getSession() cannot resurrect the session from localStorage.
  removeToken();
  return successResponse({ ok: true }, "Logged out successfully");
});

mockClient.register("POST", "/auth/switch", async ({ body }) => {
  const errs = requireFields(body as { roleId?: string }, ["roleId"]);
  if (errs.length) return validationError(errs);
  const { roleId } = body as { roleId: string };
  const targetUser = db.users.find((u) => u.roleId === roleId);
  if (!targetUser) return notFoundError(`User with role ${roleId}`);
  mockAuth.currentUserId = targetUser.id;
  return successResponse(targetUser, "Role switched");
});

mockClient.register("GET", "/auth/super-admin-password", async () =>
  successResponse({ password: superAdminPassword.current }),
);

mockClient.register("PUT", "/auth/super-admin-password", async ({ body }) => {
  const errs = requireFields(body as { password?: string }, ["password"]);
  if (errs.length) return validationError(errs);
  const { password } = body as { password: string };
  if (password.length < 8) {
    return validationError([
      {
        code: "TOO_SHORT",
        field: "password",
        message: "Password must be at least 8 characters",
      },
    ]);
  }
  superAdminPassword.current = password;
  return successResponse({ ok: true }, "Password updated");
});

/* ─────────────── USERS ─────────────── */

mockClient.register("GET", "/users", async ({ queryParams }) => {
  const { rows, pagination } = applyListQuery(db.users, queryParams, {
    searchFields: ["name", "email", "phone", "id"],
    filterFields: ["status", "roleId"],
    sortFields: ["id", "name", "email", "createdAt", "lastActive"],
  });

  const approverNameMap = db.users.reduce((map: Record<string, string>, user) => {
    map[user.id] = `${user.firstName} ${user.lastName}`.trim();
    return map;
  }, {} as Record<string, string>);

  const rowsWithApprover = rows.map((user) => ({
    ...user,
    approvedByName:
      user.approvedBy && user.approvedBy !== "SYSTEM"
        ? approverNameMap[user.approvedBy]
        : null,
  }));

  // Aggregate stats computed across the entire dataset, not the filtered page.
  const stats = {
    total: db.users.length,
    active: db.users.filter((u) => u.status === "active").length,
    inactive: db.users.filter((u) => u.status === "inactive").length,
    blocked: db.users.filter((u) => u.status === "blocked").length,
    pending: db.users.filter((u) => u.status === "pending").length,
  };
  return successResponse(rowsWithApprover, "Users retrieved", { ...pagination, stats });
});

mockClient.register("GET", "/users/:id", async ({ pathParams }) => {
  const user = db.users.find((u) => u.id === pathParams.id);
  if (!user) return notFoundError(`User ${pathParams.id}`);

  const approvedByName =
    user.approvedBy && user.approvedBy !== "SYSTEM"
      ? `${user.approvedBy ? db.users.find((u) => u.id === user.approvedBy)?.firstName : ""} ${user.approvedBy ? db.users.find((u) => u.id === user.approvedBy)?.lastName : ""}`.trim() || null
      : null;

  return successResponse({ ...user, approvedByName }, "User retrieved");
});

mockClient.register("POST", "/users", async ({ body }) => {
  const payload = (body || {}) as Partial<User>;
  const errs = requireFields(payload, ["name", "email", "roleId"]);
  if (errs.length) return validationError(errs);
  if (payload.email && !isValidEmail(payload.email)) {
    return validationError([
      {
        code: "INVALID_EMAIL",
        field: "email",
        message: "Invalid email format",
      },
    ]);
  }
  if (
    db.users.some(
      (u) => u.email.toLowerCase() === (payload.email || "").toLowerCase(),
    )
  ) {
    return conflictError("A user with this email already exists", "email");
  }
  const nextIdNum =
    Math.max(
      0,
      ...db.users.map((u) => parseInt(u.id.replace(/\D/g, ""), 10) || 0),
    ) + 1;

  const defaults = {
    address: "",
    location: "",
    bio: "",
    status: "pending" as const,
    phone: "",
  };
  const newUser = {
    ...defaults,
    ...(payload as Record<string, unknown>),
    id: `USR-${String(nextIdNum).padStart(5, "0")}`,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  } as User;
  db.users.unshift(newUser);
  return createdResponse(newUser, "User created");
});

mockClient.register("PUT", "/users/:id", async ({ pathParams, body }) => {
  const index = db.users.findIndex((u) => u.id === pathParams.id);
  if (index === -1) return notFoundError(`User ${pathParams.id}`);
  const payload = (body || {}) as Partial<User>;
  const errs = requireFields(payload, ["name", "email", "roleId"]);
  if (errs.length) return validationError(errs);
  if (payload.email && !isValidEmail(payload.email)) {
    return validationError([
      {
        code: "INVALID_EMAIL",
        field: "email",
        message: "Invalid email format",
      },
    ]);
  }
  if (
    payload.email &&
    db.users.some(
      (u: User, i: number) =>
        i !== index && u.email.toLowerCase() === payload.email!.toLowerCase(),
    )
  ) {
    return conflictError("A user with this email already exists", "email");
  }
  // Check username uniqueness
  if (payload.username !== undefined) {
    if (
      db.users.some(
        (u: User, i: number) =>
          i !== index && u.username.toLowerCase() === payload.username!.toLowerCase(),
      )
    ) {
      return conflictError("A user with this username already exists", "username");
    }
  }
  // Prevent changing role/status for protected system super admin (roleId: r1, approvedBy: SYSTEM)
  const targetUser = db.users[index];
  const isTargetProtected = targetUser.roleId === "r1" && targetUser.approvedBy === "SYSTEM";
  if (isTargetProtected) {
    if (typeof payload.status !== "undefined" || typeof payload.roleId !== "undefined") {
      return badRequestError("System protected user cannot be modified.", [{ code: "SYSTEM_PROTECTED_USER", message: "System protected user cannot be modified." }]);
    }
  }

  // Convert roleId to role
  const roleMap: Record<string, string> = {
    r1: "super_admin",
    r2: "admin",
    r3: "manager",
    r4: "viewer",
  };
  if (payload.roleId && roleMap[payload.roleId]) {
    payload.role = roleMap[payload.roleId];
  }

  // Handle firstName and lastName if provided
  if (payload.firstName) {
    payload.firstName = payload.firstName;
  }
  if (payload.lastName) {
    payload.lastName = payload.lastName;
  }

  db.users[index] = { ...db.users[index], ...payload };
  return successResponse(db.users[index], "User replaced");
});

mockClient.register("PATCH", "/users/:id", async ({ pathParams, body }) => {
  const index = db.users.findIndex((u) => u.id === pathParams.id);
  if (index === -1) return notFoundError(`User ${pathParams.id}`);
  const payload = (body || {}) as Partial<User>;
  if (payload.email !== undefined) {
    if (!isValidEmail(payload.email)) {
      return validationError([
        {
          code: "INVALID_EMAIL",
          field: "email",
          message: "Invalid email format",
        },
      ]);
    }
    if (
      db.users.some(
        (u: User, i: number) =>
          i !== index && u.email.toLowerCase() === payload.email!.toLowerCase(),
      )
    ) {
      return conflictError("A user with this email already exists", "email");
    }
  }
  // Check username uniqueness
  if (payload.username !== undefined) {
    if (
      db.users.some(
        (u: User, i: number) =>
          i !== index && u.username.toLowerCase() === payload.username!.toLowerCase(),
      )
    ) {
      return conflictError("A user with this username already exists", "username");
    }
  }
  // Prevent modifying protected system super admin (roleId: r1, approvedBy: SYSTEM)
  const targetUser = db.users[index];
  const isTargetProtected = targetUser.roleId === "r1" && targetUser.approvedBy === "SYSTEM";
  
  if (isTargetProtected) {
    return badRequestError("System protected user cannot be modified.", [{ code: "SYSTEM_PROTECTED_USER", message: "System protected user cannot be modified." }]);
  }

  // Convert roleId to role
  const roleMap: Record<string, string> = {
    r1: "super_admin",
    r2: "admin",
    r3: "manager",
    r4: "viewer",
  };
  if (payload.roleId && roleMap[payload.roleId]) {
    payload.role = roleMap[payload.roleId];
  }

  // Handle firstName and lastName if provided
  if (payload.firstName) {
    payload.firstName = payload.firstName;
  }
  if (payload.lastName) {
    payload.lastName = payload.lastName;
  }

  // If the status changes to active, record the current approver
  if (
    payload.status &&
    payload.status.toLowerCase() === "active" &&
    db.users[index].status !== "active"
  ) {
    payload.approvedAt = new Date().toISOString();
    payload.approvedBy = mockAuth.currentUserId || "SYSTEM";
  }

  db.users[index] = { ...db.users[index], ...payload };
  return successResponse(db.users[index], "User updated");
});

mockClient.register("DELETE", "/users/:id", async ({ pathParams }) => {
  const index = db.users.findIndex((u) => u.id === pathParams.id);
  if (index === -1) return notFoundError(`User ${pathParams.id}`);
  
  // Prevent deleting protected system super admin (roleId: r1, approvedBy: SYSTEM)
  const targetUser = db.users[index];
  const isTargetProtected = targetUser.roleId === "r1" && targetUser.approvedBy === "SYSTEM";
  
  if (isTargetProtected) {
    return badRequestError("System protected user cannot be deleted.", [{ code: "SYSTEM_PROTECTED_USER", message: "System protected user cannot be deleted." }]);
  }

  db.users.splice(index, 1);
  return successResponse({ ok: true }, "User deleted");
});

mockClient.register("POST", "/users/:id/reset-password", async ({ pathParams, body }) => {
  const index = db.users.findIndex((u) => u.id === pathParams.id);
  if (index === -1) return notFoundError(`User ${pathParams.id}`);
  
  const payload = (body || {}) as { password?: string; confirmPassword?: string };
  const errs = requireFields(payload, ["password", "confirmPassword"]);
  if (errs.length) return validationError(errs);
  
  // Validate password policy (matching backend validation)
  const password = payload.password!;
  const passwordErrors: ApiError[] = [];
  
  if (password.length < 8) {
    passwordErrors.push({
      code: "TOO_SHORT",
      field: "password",
      message: "Password must be at least 8 characters",
    });
  }
  if (!/[A-Z]/.test(password)) {
    passwordErrors.push({
      code: "MISSING_UPPERCASE",
      field: "password",
      message: "Password must contain at least one uppercase letter",
    });
  }
  if (!/[a-z]/.test(password)) {
    passwordErrors.push({
      code: "MISSING_LOWERCASE",
      field: "password",
      message: "Password must contain at least one lowercase letter",
    });
  }
  if (!/[0-9]/.test(password)) {
    passwordErrors.push({
      code: "MISSING_NUMBER",
      field: "password",
      message: "Password must contain at least one number",
    });
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    passwordErrors.push({
      code: "MISSING_SPECIAL_CHAR",
      field: "password",
      message: "Password must contain at least one special character",
    });
  }
  
  if (passwordErrors.length > 0) {
    return validationError(passwordErrors);
  }
  
  if (payload.password !== payload.confirmPassword) {
    return validationError([
      {
        code: "PASSWORD_MISMATCH",
        field: "confirmPassword",
        message: "Passwords do not match",
      },
    ]);
  }
  
  // Update user password (in mock, we just store it)
  db.users[index] = { ...db.users[index], password: payload.password, updatedAt: new Date().toISOString() };
  return successResponse({ ok: true }, "Password reset successfully");
});

/* ─────────────── ROLES ─────────────── */

mockClient.register("GET", "/roles", async ({ queryParams }) => {
  const { rows, pagination } = applyListQuery(db.roles, queryParams, {
    searchFields: ["name", "description"],
    sortFields: ["name", "createdAt"],
  });
  return successResponse(rows, "Roles retrieved", pagination);
});

mockClient.register("POST", "/roles", async ({ body }) => {
  const payload = (body || {}) as Partial<Role>;
  const errs = requireFields(payload, ["name"]);
  if (errs.length) return validationError(errs);
  if (
    db.roles.some(
      (r: Role) => r.name.toLowerCase() === (payload.name || "").toLowerCase(),
    )
  ) {
    return conflictError("A role with this name already exists", "name");
  }
  
  // Generate sequential role ID (r5, r6, ...) based on existing roles
  const existingRoleNumbers = db.roles
    .map((r) => parseInt(r.id.replace("r", ""), 10))
    .filter((n) => !isNaN(n));
  const nextRoleNumber = existingRoleNumbers.length > 0 ? Math.max(...existingRoleNumbers) + 1 : 5;
  
  // Get current user ID for createdBy field
  const currentUserId = mockAuth.currentUserId || "SYSTEM";
  
  const roleDefaults = {
    permissionIds: [] as string[],
    color: "from-slate-500 to-slate-700",
    description: "",
    isSystem: false,
    createdBy: currentUserId,
  };
  const newRole = {
    ...roleDefaults,
    ...(payload as Record<string, unknown>),
    id: `r${nextRoleNumber}`,
    createdAt: new Date().toISOString(),
  } as Role;
  db.roles.push(newRole);
  return createdResponse(newRole, "Role created");
});

mockClient.register("PUT", "/roles/:id", async ({ pathParams, body }) => {
  const index = db.roles.findIndex((r) => r.id === pathParams.id);
  if (index === -1) return notFoundError(`Role ${pathParams.id}`);
  // Prevent modification of Super Admin only
  if (db.roles[index].id === "r1") {
    return badRequestError("Super Admin role cannot be modified");
  }
  const payload = (body || {}) as Partial<Role>;
  const isPermissionOnlyUpdate =
    Array.isArray(payload.permissionIds) && Object.keys(payload).length === 1;
  if (!isPermissionOnlyUpdate) {
    const errs = requireFields(payload, ["name"]);
    if (errs.length) return validationError(errs);
  }
  db.roles[index] = { ...db.roles[index], ...payload };

  return successResponse(db.roles[index], "Role replaced");
});

mockClient.register("PATCH", "/roles/:id", async ({ pathParams, body }) => {
  const index = db.roles.findIndex((r) => r.id === pathParams.id);
  if (index === -1) return notFoundError(`Role ${pathParams.id}`);
  // Prevent modification of Super Admin only
  if (db.roles[index].id === "r1") {
    return badRequestError("Super Admin role cannot be modified");
  }
  const payload = (body || {}) as Partial<Role>;
  db.roles[index] = { ...db.roles[index], ...payload };
  return successResponse(db.roles[index], "Role updated");
});

mockClient.register("DELETE", "/roles/:id", async ({ pathParams }) => {
  const index = db.roles.findIndex((r) => r.id === pathParams.id);
  if (index === -1) return notFoundError(`Role ${pathParams.id}`);
  // Prevent deletion of Super Admin only
  if (db.roles[index].id === "r1") {
    return badRequestError("Super Admin role cannot be deleted");
  }
  db.roles.splice(index, 1);
  return successResponse({ ok: true }, "Role deleted");
});

/* ─────────────── PERMISSIONS ─────────────── */

mockClient.register("GET", "/permissions", async ({ queryParams }) => {
  // Calculate assignedRolesCount for each permission
  const permissionsWithCount = db.permissions.map((perm: Permission) => {
    const assignedRolesCount = db.roles.filter((role: Role) => 
      role.permissionIds.includes(perm.id)
    ).length;
    return { ...perm, assignedRolesCount };
  });
  
  const { rows, pagination } = applyListQuery(permissionsWithCount, queryParams, {
    searchFields: ["name", "key", "module", "description"],
    filterFields: ["module"],
    sortFields: ["name", "module", "key"],
  });
  return successResponse(rows, "Permissions retrieved", pagination);
});

mockClient.register("GET", "/permissions/:id", async ({ pathParams }) => {
  const permission = db.permissions.find((p: Permission) => p.id === pathParams.id);
  if (!permission) return notFoundError(`Permission ${pathParams.id}`);
  
  const assignedRolesCount = db.roles.filter((role: Role) => 
    role.permissionIds.includes(permission.id)
  ).length;
  
  return successResponse({ ...permission, assignedRolesCount }, "Permission retrieved");
});

mockClient.register("POST", "/permissions", async ({ body }) => {
  console.log("mockClient POST /permissions - body:", body);
  const payload = (body || {}) as Partial<Permission>;
  const errs = requireFields(payload, ["name", "key", "module"]);
  if (errs.length) return validationError(errs);
  // Validate key format (lowercase letters and dots only) - matches backend validation
  if (payload.key && !/^[a-z.]+$/.test(payload.key)) {
    return validationError([
      {
        code: "INVALID_FORMAT",
        field: "key",
        message: "Key must contain only lowercase letters and dots (e.g. users.create)",
      },
    ]);
  }
  if (db.permissions.some((p: Permission) => p.key === payload.key)) {
    return conflictError("A permission with this key already exists", "key");
  }
  const newPerm = {
    description: "",
    ...(payload as Record<string, unknown>),
    id: `p${Date.now()}`,
  } as Permission;
  db.permissions.push(newPerm);
  return createdResponse(newPerm, "Permission created");
});

mockClient.register("PUT", "/permissions/:id", async ({ pathParams, body }) => {
  const index = db.permissions.findIndex((p) => p.id === pathParams.id);
  if (index === -1) return notFoundError(`Permission ${pathParams.id}`);
  const payload = (body || {}) as Partial<Permission>;
  const errs = requireFields(payload, ["name", "module"]);
  if (errs.length) return validationError(errs);
  // Validate key format if provided (lowercase letters and dots only) - matches backend validation
  if (payload.key && !/^[a-z.]+$/.test(payload.key)) {
    return validationError([
      {
        code: "INVALID_FORMAT",
        field: "key",
        message: "Key must contain only lowercase letters and dots (e.g. users.create)",
      },
    ]);
  }
  // Don't allow key to be updated
  const { key, ...updateData } = payload;
  db.permissions[index] = { ...db.permissions[index], ...updateData };
  return successResponse(db.permissions[index], "Permission replaced");
});

mockClient.register(
  "PATCH",
  "/permissions/:id",
  async ({ pathParams, body }) => {
    const index = db.permissions.findIndex((p) => p.id === pathParams.id);
    if (index === -1) return notFoundError(`Permission ${pathParams.id}`);
    const payload = (body || {}) as Partial<Permission>;
    // Validate key format if provided (lowercase letters and dots only) - matches backend validation
    if (payload.key && !/^[a-z.]+$/.test(payload.key)) {
      return validationError([
        {
          code: "INVALID_FORMAT",
          field: "key",
          message: "Key must contain only lowercase letters and dots (e.g. users.create)",
        },
      ]);
    }
    // Don't allow key to be updated
    const { key, ...updateData } = payload;
    db.permissions[index] = { ...db.permissions[index], ...updateData };
    return successResponse(db.permissions[index], "Permission updated");
  },
);

mockClient.register("DELETE", "/permissions/:id", async ({ pathParams }) => {
  const index = db.permissions.findIndex((p) => p.id === pathParams.id);
  if (index === -1) return notFoundError(`Permission ${pathParams.id}`);
  
  const permission = db.permissions[index];
  
  // Check if permission is assigned to any roles
  const assignedRolesCount = db.roles.filter((role: Role) => 
    role.permissionIds.includes(permission.id)
  ).length;
  
  if (assignedRolesCount > 0) {
    return badRequestError(
      `Permission is assigned to ${assignedRolesCount} roles. Remove it from all roles before deleting.`,
      [{ code: "PERMISSION_ASSIGNED_TO_ROLES", message: `Permission is assigned to ${assignedRolesCount} roles. Remove it from all roles before deleting.` }]
    );
  }
  
  db.permissions.splice(index, 1);
  return successResponse({ ok: true }, "Permission deleted");
});

/* ─────────────── NAVIGATION ─────────────── */

mockClient.register("GET", "/navigation", async () =>
  successResponse(structuredClone(db.navigation), "Navigation retrieved"),
);

/* ─────────────── PAYMENTS ─────────────── */

mockClient.register("GET", "/payments", async ({ queryParams }) => {
  // Filter by userId if provided
  let payments = db.payments;
  if (queryParams.userId) {
    payments = payments.filter((p) => p.userId === queryParams.userId);
  }
  
  const { rows, pagination } = applyListQuery(payments, queryParams, {
    searchFields: ["transactionId", "utrNumber", "notes"],
    filterFields: ["status", "direction", "category", "paymentSource", "paymentMethod"],
    sortFields: ["transactionId", "amount", "paymentDate", "createdAt"],
  });
  return successResponse(rows, "Payments retrieved", pagination);
});

mockClient.register("GET", "/payments/:id", async ({ pathParams }) => {
  const payment = db.payments.find((p) => p.transactionId === pathParams.id);
  if (!payment) return notFoundError(`Payment ${pathParams.id}`);
  return successResponse(payment, "Payment retrieved");
});

let mockTransactionIdCounter = 0;

const initializeMockTransactionIdCounter = () => {
  if (mockTransactionIdCounter === 0 && db.payments.length > 0) {
    const lastPayment = db.payments.reduce((latest, p) => {
      const match = p.transactionId?.match(/TXN-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > latest ? num : latest;
      }
      return latest;
    }, 0);
    mockTransactionIdCounter = lastPayment;
  }
};

mockClient.register("POST", "/payments", async ({ body }) => {
  const payload = (body || {}) as Partial<PaymentRecord>;
  const errs = requireFields(payload, ["userId", "amount", "direction", "status", "category", "paymentSource", "paymentMethod", "paymentDate", "utrNumber"]);
  if (errs.length) return validationError(errs);
  
  // Check if UTR number is empty or whitespace
  if (!payload.utrNumber?.trim()) {
    return validationError(["UTR number is required"]);
  }
  
  initializeMockTransactionIdCounter();
  mockTransactionIdCounter++;
  
  const newPayment = {
    ...(payload as Record<string, unknown>),
    transactionId: `TXN-${String(mockTransactionIdCounter).padStart(6, "0")}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as PaymentRecord;
  db.payments.unshift(newPayment);
  return createdResponse(newPayment, "Payment created");
});

mockClient.register("PUT", "/payments/:id", async ({ pathParams, body }) => {
  const index = db.payments.findIndex((p) => p.transactionId === pathParams.id);
  if (index === -1) return notFoundError(`Payment ${pathParams.id}`);
  const payload = (body || {}) as Partial<PaymentRecord>;
  const now = new Date().toISOString();
  
  db.payments[index] = { 
    ...db.payments[index], 
    ...payload, 
    updatedAt: now,
  };
  
  return successResponse(db.payments[index], "Payment replaced");
});

mockClient.register("PATCH", "/payments/:id", async ({ pathParams, body }) => {
  const index = db.payments.findIndex((p) => p.transactionId === pathParams.id);
  if (index === -1) return notFoundError(`Payment ${pathParams.id}`);
  const payload = (body || {}) as Partial<PaymentRecord>;
  db.payments[index] = { ...db.payments[index], ...payload, updatedAt: new Date().toISOString() };
  return successResponse(db.payments[index], "Payment updated");
});

mockClient.register("DELETE", "/payments/:id", async ({ pathParams }) => {
  const index = db.payments.findIndex((p) => p.transactionId === pathParams.id);
  if (index === -1) return notFoundError(`Payment ${pathParams.id}`);
  db.payments.splice(index, 1);
  return successResponse({ ok: true }, "Payment deleted");
});

mockClient.register("GET", "/payments/transactions", async ({ queryParams }) => {
  const userId = queryParams.userId;
  let payments = db.payments;
  
  // Filter by userId if provided
  if (userId) {
    payments = payments.filter(p => p.userId === userId);
  }
  
  const { rows, pagination } = applyListQuery(payments, queryParams, {
    searchFields: ["id", "utrNumber", "notes"],
    filterFields: ["status", "direction", "category", "paymentSource", "paymentMethod"],
    sortFields: ["id", "amount", "paymentDate", "createdAt"],
  });
  return successResponse(rows, "Transactions retrieved", pagination);
});

mockClient.register("GET", "/payments/transactions/:id", async ({ pathParams }) => {
  const payment = db.payments.find((p) => p.transactionId === pathParams.id);
  if (!payment) return notFoundError(`Transaction ${pathParams.id}`);
  return successResponse(payment, "Transaction retrieved");
});



/* ─────────────── LOGS ─────────────── */

mockClient.register("GET", "/logs", async ({ queryParams }) => {
  const { rows, pagination } = applyListQuery(db.logs, queryParams, {
    searchFields: ["action", "target", "userId", "ip"],
    filterFields: ["type", "userId"],
    sortFields: ["timestamp"],
  });
  return successResponse(rows, "Logs retrieved", pagination);
});

mockClient.register("POST", "/logs", async ({ body }) => {
  const payload = (body || {}) as Partial<ActivityLog>;
  const errs = requireFields(payload, ["userId", "action", "target", "type"]);
  if (errs.length) return validationError(errs);
  const newLog: ActivityLog = {
    id: `l${Date.now()}`,
    timestamp: new Date().toISOString(),
    ip: "192.168.1.1",
    ...(payload as Omit<ActivityLog, "id" | "timestamp" | "ip">),
  };
  db.logs.unshift(newLog);
  return createdResponse(newLog, "Log recorded");
});

export { mockClient };
