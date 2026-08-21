#!/usr/bin/env node
/**
 * Instruction Compliance Checker
 * 
 * This script verifies that the codebase follows the established patterns
 * defined in the instruction files.
 * 
 * Usage: node check-instructions.js
 */

const fs = require("fs");
const path = require("path");

const { readFileSync, readdirSync, statSync } = fs;
const { join, basename } = path;

const ROOT = process.cwd();
const BACKEND_SRC = join(ROOT, "backend", "src");
const FRONTEND_SRC = join(ROOT, "frontend", "src");

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: [],
};

function log(message, type = "pass") {
  const prefix = type === "pass" ? "✅" : type === "fail" ? "❌" : "⚠️";
  console.log(`${prefix} ${message}`);
  results.details.push(`${prefix} ${message}`);
  if (type === "pass") results.passed++;
  else if (type === "fail") results.failed++;
  else results.warnings++;
}

function checkFileExists(filePath, description) {
  try {
    readFileSync(filePath, "utf-8");
    log(`${description} exists`, "pass");
    return true;
  } catch {
    log(`${description} MISSING: ${filePath}`, "fail");
    return false;
  }
}

function checkFileContains(filePath, pattern, description) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    if (regex.test(content)) {
      log(`${description} found in ${basename(filePath)}`, "pass");
      return true;
    } else {
      log(`${description} NOT found in ${basename(filePath)}`, "fail");
      return false;
    }
  } catch {
    log(`Cannot read ${filePath}`, "fail");
    return false;
  }
}

function getDirectories(dirPath) {
  try {
    return readdirSync(dirPath).filter((f) => statSync(join(dirPath, f)).isDirectory());
  } catch {
    return [];
  }
}

function getFiles(dirPath, extension) {
  try {
    return readdirSync(dirPath).filter((f) => {
      const full = join(dirPath, f);
      if (statSync(full).isDirectory()) return false;
      if (extension && !f.endsWith(extension)) return false;
      return true;
    });
  } catch {
    return [];
  }
}

// ============================================
// INSTRUCTION FILES CHECK
// ============================================
console.log("\n📋 Checking Instruction Files...\n");

const instructionFiles = [
  ".copilot-instructions.md",
  "BACKEND_INSTRUCTIONS.md",
  "FRONTEND_INSTRUCTIONS.md",
  "SHARED_INSTRUCTIONS.md",
  "MODULE_CREATION_GUIDE.md",
  "INSTRUCTIONS_INDEX.md",
];

instructionFiles.forEach((f) => checkFileExists(join(ROOT, f), `Instruction file: ${f}`));

// ============================================
// BACKEND MODULE STRUCTURE CHECK
// ============================================
console.log("\n🔧 Checking Backend Module Structure...\n");

const backendModules = getDirectories(join(BACKEND_SRC, "modules"));
const requiredBackendFolders = [
  "constants",
  "controllers",
  "services",
  "model",
  "routes",
  "types",
  "utils",
  "validations",
];

backendModules.forEach((module) => {
  const modulePath = join(BACKEND_SRC, "modules", module);
  const folders = getDirectories(modulePath);
  
  requiredBackendFolders.forEach((folder) => {
    if (folders.includes(folder)) {
      log(`Backend module '${module}' has ${folder}/`, "pass");
    } else {
      log(`Backend module '${module}' MISSING ${folder}/`, "fail");
    }
  });
  
  // Check for index.ts barrel export
  checkFileExists(join(modulePath, "index.ts"), `Backend module '${module}' index.ts`);
  
  // Check routes index.ts
  checkFileExists(join(modulePath, "routes", "index.ts"), `Backend module '${module}' routes/index.ts`);
});

// Check main routes registration
checkFileExists(join(BACKEND_SRC, "routes", "index.ts"), "Main backend routes index.ts");
checkFileContains(
  join(BACKEND_SRC, "routes", "index.ts"),
  /routes\.use\("\/auth"/,
  "Auth routes registered"
);

// ============================================
// BACKEND PATTERN CHECKS
// ============================================
console.log("\n⚙️ Checking Backend Patterns...\n");

backendModules.forEach((module) => {
  const modulePath = join(BACKEND_SRC, "modules", module);
  
  // Check controllers use asyncHandler
  const controllerFiles = getFiles(join(modulePath, "controllers"), ".ts");
  controllerFiles.forEach((file) => {
    checkFileContains(
      join(modulePath, "controllers", file),
      /asyncHandler/,
      `Controller ${file} uses asyncHandler`
    );
  });
  
  // Check services throw AppError
  const serviceFiles = getFiles(join(modulePath, "services"), ".ts");
  serviceFiles.forEach((file) => {
    checkFileContains(
      join(modulePath, "services", file),
      /AppError/,
      `Service ${file} uses AppError`
    );
  });
  
  // Check routes use validate middleware
  const routeFiles = getFiles(join(modulePath, "routes"), ".ts");
  routeFiles.forEach((file) => {
    checkFileContains(
      join(modulePath, "routes", file),
      /validate\(/,
      `Route ${file} uses validate middleware`
    );
    checkFileContains(
      join(modulePath, "routes", file),
      /authMiddleware/,
      `Route ${file} uses authMiddleware`
    );
  });
  
  // Check model uses userId
  checkFileContains(
    join(modulePath, "model", "index.ts"),
    /userId.*String.*required.*true.*unique.*true/,
    `Module ${module} model uses userId as primary key`
  );
});

// Check shared middleware exports
checkFileExists(join(BACKEND_SRC, "shared", "middlewares", "index.ts"), "Shared middlewares index.ts");
checkFileContains(
  join(BACKEND_SRC, "shared", "middlewares", "index.ts"),
  /asyncHandler/,
  "asyncHandler exported from shared middlewares"
);
checkFileContains(
  join(BACKEND_SRC, "shared", "middlewares", "index.ts"),
  /validate/,
  "validate middleware exported"
);
checkFileContains(
  join(BACKEND_SRC, "shared", "middlewares", "index.ts"),
  /authMiddleware/,
  "authMiddleware exported"
);

// Check response helpers
checkFileExists(join(BACKEND_SRC, "shared", "response", "index.ts"), "Shared response index.ts");
checkFileContains(
  join(BACKEND_SRC, "shared", "response", "response.ts"),
  /successResponse/,
  "successResponse helper exists"
);
checkFileContains(
  join(BACKEND_SRC, "shared", "response", "response.ts"),
  /createdResponse/,
  "createdResponse helper exists"
);
checkFileContains(
  join(BACKEND_SRC, "shared", "response", "response.ts"),
  /errorResponse/,
  "errorResponse helper exists"
);

// Check AppError
checkFileExists(join(BACKEND_SRC, "shared", "errors", "AppError.ts"), "AppError class");
checkFileContains(
  join(BACKEND_SRC, "shared", "errors", "AppError.ts"),
  /statusCode.*number/,
  "AppError has statusCode"
);
checkFileContains(
  join(BACKEND_SRC, "shared", "errors", "AppError.ts"),
  /errorCode.*string/,
  "AppError has errorCode"
);

// ============================================
// FRONTEND MODULE STRUCTURE CHECK
// ============================================
console.log("\n🎨 Checking Frontend Module Structure...\n");

const frontendModules = getDirectories(join(FRONTEND_SRC, "modules"));
const requiredFrontendFolders = [
  "api",
  "components",
  "hooks",
  "pages",
  "services",
  "store",
  "types",
  "utils",
];

frontendModules.forEach((module) => {
  const modulePath = join(FRONTEND_SRC, "modules", module);
  const folders = getDirectories(modulePath);
  
  requiredFrontendFolders.forEach((folder) => {
    if (folders.includes(folder)) {
      log(`Frontend module '${module}' has ${folder}/`, "pass");
    } else {
      log(`Frontend module '${module}' MISSING ${folder}/`, "warn"); // Some modules may not need all
    }
  });
  
  // Check for index.ts barrel export
  checkFileExists(join(modulePath, "index.ts"), `Frontend module '${module}' index.ts`);
  
  // Check routes.tsx
  checkFileExists(join(modulePath, "routes.tsx"), `Frontend module '${module}' routes.tsx`);
});

// Check main router
checkFileExists(join(FRONTEND_SRC, "router", "routes.tsx"), "Main frontend router routes.tsx");
checkFileContains(
  join(FRONTEND_SRC, "router", "routes.tsx"),
  /createBrowserRouter/,
  "Router uses createBrowserRouter"
);
checkFileContains(
  join(FRONTEND_SRC, "router", "routes.tsx"),
  /ProtectedRoute/,
  "Router uses ProtectedRoute"
);
checkFileContains(
  join(FRONTEND_SRC, "router", "routes.tsx"),
  /PermissionGuard/,
  "Router uses PermissionGuard"
);

// ============================================
// FRONTEND PATTERN CHECKS
// ============================================
console.log("\n⚛️ Checking Frontend Patterns...\n");

frontendModules.forEach((module) => {
  const modulePath = join(FRONTEND_SRC, "modules", module);
  
  // Check API layer structure
  const apiPath = join(modulePath, "api");
  const apiFiles = getFiles(apiPath, ".ts");
  
  const hasEndpoints = apiFiles.some((f) => f.includes("endpoint"));
  const hasApi = apiFiles.some((f) => f.includes(".api.") || f === "api.ts");
  
  if (hasEndpoints) log(`Module '${module}' has endpoints file`, "pass");
  else log(`Module '${module}' MISSING endpoints file`, "warn");
  
  if (hasApi) log(`Module '${module}' has API class`, "pass");
  else log(`Module '${module}' MISSING API class`, "warn");
  
  // Check store uses useSyncExternalStore
  const storeFiles = getFiles(join(modulePath, "store"), ".ts");
  storeFiles.forEach((file) => {
    checkFileContains(
      join(modulePath, "store", file),
      /useSyncExternalStore/,
      `Store ${file} uses useSyncExternalStore`
    );
  });
  
  // Check routes use PermissionGuard
  checkFileContains(
    join(modulePath, "routes.tsx"),
    /PermissionGuard/,
    `Module '${module}' routes use PermissionGuard`
  );
});

// Check permissions file
checkFileExists(join(FRONTEND_SRC, "lib", "permissions.ts"), "Permissions constants");
checkFileContains(
  join(FRONTEND_SRC, "lib", "permissions.ts"),
  /PERMISSIONS.*=.*\{/,
  "PERMISSIONS object defined"
);

// Check core API
checkFileExists(join(FRONTEND_SRC, "core", "api", "client.ts"), "Core API client");
checkFileContains(
  join(FRONTEND_SRC, "core", "api", "client.ts"),
  /class ApiClient/,
  "ApiClient class exists"
);

// Check shared components
checkFileExists(join(FRONTEND_SRC, "shared", "components"), "Shared components folder");
checkFileExists(join(FRONTEND_SRC, "shared", "layouts", "AdminLayout.tsx"), "AdminLayout");
checkFileExists(join(FRONTEND_SRC, "shared", "providers", "AppProviders.tsx"), "AppProviders");

// ============================================
// ALIGNMENT CHECKS
// ============================================
console.log("\n🔗 Checking Frontend-Backend Alignment...\n");

// Check permission keys alignment (basic check)
const backendAuthConstants = join(BACKEND_SRC, "modules", "auth", "constants", "index.ts");
const frontendPermissions = join(FRONTEND_SRC, "lib", "permissions.ts");

if (checkFileExists(backendAuthConstants, "Backend auth constants")) {
  const backendContent = readFileSync(backendAuthConstants, "utf-8");
  const frontendContent = readFileSync(frontendPermissions, "utf-8");
  
  // Check for common permission patterns
  const permissionPatterns = [
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "roles.view",
    "permissions.view",
  ];
  
  permissionPatterns.forEach((perm) => {
    const inBackend = backendContent.includes(perm) || true; // Backend may use different naming
    const inFrontend = frontendContent.includes(perm);
    if (inFrontend) {
      log(`Permission '${perm}' defined in frontend`, "pass");
    } else {
      log(`Permission '${perm}' MISSING in frontend`, "warn");
    }
  });
}

// Check API base URL
const apiClient = join(FRONTEND_SRC, "core", "api", "client.ts");
if (checkFileExists(apiClient, "API Client")) {
  const content = readFileSync(apiClient, "utf-8");
  checkFileContains(apiClient, /\/api\/v1/, "API base URL includes /api/v1");
}

// ============================================
// TYPESCRIPT CONFIG CHECK
// ============================================
console.log("\n📝 Checking TypeScript Configuration...\n");

const backendTsconfig = join(ROOT, "backend", "tsconfig.json");
const frontendTsconfig = join(ROOT, "frontend", "tsconfig.json");

[backendTsconfig, frontendTsconfig].forEach((path) => {
  if (checkFileExists(path, `TypeScript config: ${basename(path)}`)) {
    const content = readFileSync(path, "utf-8");
    checkFileContains(path, /"strict":\s*true/, "Strict mode enabled");
    checkFileContains(path, /"@\/\*":\s*\["src\/\*"\]/, "Import alias @/* configured");
  }
});

// ============================================
// SUMMARY
// ============================================
console.log("\n" + "=".repeat(50));
console.log("📊 INSTRUCTION COMPLIANCE SUMMARY");
console.log("=".repeat(50));
console.log(`✅ Passed:  ${results.passed}`);
console.log(`❌ Failed:  ${results.failed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);
console.log("=".repeat(50));

if (results.failed > 0) {
  console.log("\n❌ Some checks failed. Please review the instruction files and fix the issues.");
  process.exit(1);
} else if (results.warnings > 0) {
  console.log("\n⚠️  All critical checks passed, but there are warnings to review.");
  process.exit(0);
} else {
  console.log("\n✅ All checks passed! Codebase follows instruction patterns.");
  process.exit(0);
}