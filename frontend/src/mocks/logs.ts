import type { ActivityLog } from "@/lib/types";
import { mockUsers } from "./users";

const actions = [
  { action: "Signed in", type: "login" as const },
  { action: "Signed out", type: "logout" as const },
  { action: "Created user", type: "create" as const },
  { action: "Updated profile", type: "update" as const },
  { action: "Deleted user", type: "delete" as const },
  { action: "Assigned role", type: "permission" as const },
  { action: "Updated permissions", type: "permission" as const },
  { action: "Created role", type: "create" as const },
  { action: "Reset password", type: "update" as const },
  { action: "Changed status", type: "update" as const },
];

function seededRandom(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function generateLogs(count: number): ActivityLog[] {
  const rand = seededRandom(9);
  const logs: ActivityLog[] = [];
  for (let i = 0; i < count; i++) {
    const a = pick(actions, rand);
    const user = pick(mockUsers, rand);
    const target = pick(mockUsers, rand);
    const daysAgo = Math.floor(rand() * 60);
    logs.push({
      id: `l${i + 1}`,
      userId: user.id,
      action: a.action,
      target: a.type === "login" || a.type === "logout" ? "Account" : target.name,
      type: a.type,
      timestamp: new Date(Date.now() - daysAgo * 86400000 - Math.floor(rand() * 86400000)).toISOString(),
      ip: `${10 + Math.floor(rand() * 240)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}`,
    });
  }
  return logs.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
}

export const mockLogs = generateLogs(80);
