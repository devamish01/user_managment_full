/**
 * Core mock-backend barrel.
 *
 * Exposes:
 *   - db         : the in-memory mock data store
 *   - mockClient : the in-memory HTTP server that services ApiClient requests
 *
 * `src/api/index.ts` re-exports `mockClient` from here so that existing
 * `import { mockClient } from "@/api"` consumers keep working unchanged.
 */
export { db } from "./db";
export { mockClient } from "./mockClient";
