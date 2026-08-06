import type { Role } from "@/lib/types";
import { mockPermissions } from "./permissions";

const ALL_PERMS = mockPermissions.map((p) => p.id);

export const mockRoles: Role[] = [
  {
    id: "r1",
    name: "Super Admin",
    description: "Full unrestricted access — permissions cannot be modified for this role",
    color: "from-violet-500 to-indigo-600",
    permissionIds: ALL_PERMS,
    createdAt: "2024-01-10",
    isSystem: true,
    createdBy: "SYSTEM",
  },
  {
    id: "r2",
    name: "Admin",
    description: "Manages users, roles and integrations",
    color: "from-blue-500 to-cyan-500",
    permissionIds: [
      "p1","p2","p4","p5","p6","p7",
      "p8","p9","p10","p11","p30",
      "p19","p20","p21","p22","p23","p24","p25","p26","p27","p28","p29","p30",
      "p12","p31","p32","p14",
      "p33","p34",
      "p13",
      "p36","p37",
      "p42",
      "p43","p44",
      "p16","p17","p18",
      "p15","p38","p39","p40","p41"
    ],
    createdAt: "2024-01-12",
    isSystem: false,
    createdBy: "SYSTEM",
  },
  {
    id: "r3",
    name: "Manager",
    description: "Team lead — can view and manage users but no access to roles or system tools",
    color: "from-emerald-500 to-teal-500",
    permissionIds: [
      "p1","p2","p7",
      "p8","p9","p11","p30",
      "p19","p20","p21","p22","p23","p24","p25","p26","p27","p28","p29","p30",
      "p38","p39"
    ],
    createdAt: "2024-02-01",
    isSystem: false,
    createdBy: "SYSTEM",
  },
  {
    id: "r4",
    name: "Default Viewer",
    description: "Read-only access to Dashboard and Users List — fallback role when other roles are deleted",
    color: "from-slate-500 to-slate-600",
    permissionIds: [
      "p1","p2","p7"
    ],
    createdAt: "2024-01-10",
    isSystem: true,
    createdBy: "SYSTEM",
  },
];
