import * as React from "react";
import {
  Users,
  Key,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { useStore } from "@/store";
import useUsersStore from "@/modules/users/store";
import { timeAgo, statusColor } from "@/lib/helpers";
import { DashboardSkeleton } from "@/modules/dashboard/components";
import { userRoutesConfig } from "@/modules/users/routes";
import { logsRoutesConfig } from "@/modules/logs/routes";

const StatCard = ({
  title,
  value,
  change,
  icon,
  gradient,
  positive = true,
}: {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  gradient: string;
  positive?: boolean;
}) => (
  <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <div
            className={`inline-flex items-center gap-1 text-xs font-semibold ${
              positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
            <span className="font-normal text-muted-foreground">vs last month</span>
          </div>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const { roles, permissions, logs, currentRoleId } = useStore();
  const { users, loading: usersLoading } = useUsersStore();
  const navigate = useNavigate();
  const canCreate = currentRoleId === "r1" || currentRoleId === "r2" || currentRoleId === "r3";
  const canViewLogs = currentRoleId === "r1" || currentRoleId === "r2";

  const active = users.filter((u) => u.status === "active").length;
  const inactive = users.filter((u) => u.status === "inactive").length;
  const blocked = users.filter((u) => u.status === "blocked").length;
  const pending = users.filter((u) => u.status === "pending").length;

  const recentUsers = [...users]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);
  const recentLogs = logs.slice(0, 6);

  if (usersLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back, Alex 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening across your workspace today.
          </p>
        </div>
        <div className="flex gap-2">
          {canViewLogs && (
            <Button variant="outline" onClick={() => navigate(logsRoutesConfig.root())}>
              <Activity size={14} /> View Logs
            </Button>
          )}
          {canCreate && (
            <Button onClick={() => navigate(userRoutesConfig.create())}>
              <UserPlus size={14} /> New User
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard
          title="Total Users List"
          value={users.length}
          change="+12.5%"
          icon={<Users size={20} />}
          gradient="from-violet-500 to-indigo-600"
        />
        <StatCard
          title="Active Users"
          value={active}
          change="+8.2%"
          icon={<UserCheck size={20} />}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard
          title="Inactive Users"
          value={inactive}
          change="-2.4%"
          icon={<UserX size={20} />}
          gradient="from-slate-400 to-slate-600"
          positive={false}
        />
        <StatCard
          title="Blocked Users"
          value={blocked}
          change="+1.2%"
          icon={<UserX size={20} />}
          gradient="from-red-500 to-rose-600"
          positive={false}
        />
        <StatCard
          title="Pending Users"
          value={pending}
          change="+5.0%"
          icon={<Activity size={20} />}
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>User Growth</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                New signups over the last 30 days
              </p>
            </div>
            <Badge variant="success">+24% growth</Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-end gap-3">
              <p className="text-4xl font-bold tracking-tight">{users.length}</p>
              <p className="pb-1 text-sm text-emerald-600 dark:text-emerald-400">+18 this week</p>
            </div>
            <div className="flex h-40 items-end gap-1.5">
              {Array.from({ length: 30 }).map((_, i) => {
                const h = 20 + Math.sin(i / 2.5) * 30 + Math.random() * 50;
                const isToday = i === 29;
                return (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-t-md transition-all hover:opacity-80 ${
                      isToday
                        ? "bg-gradient-to-t from-primary to-purple-500"
                        : "bg-gradient-to-t from-primary/30 to-primary/60"
                    }`}
                    title={`Day ${i + 1}`}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Status</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Distribution overview</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Active", count: active, icon: <UserCheck size={16} />, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
              { label: "Inactive", count: inactive, icon: <UserX size={16} />, color: "bg-slate-500", text: "text-slate-600 dark:text-slate-400" },
              { label: "Blocked", count: blocked, icon: <UserX size={16} />, color: "bg-red-500", text: "text-red-600 dark:text-red-400" },
              { label: "Pending", count: pending, icon: <Activity size={16} />, color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
            ].map((s) => {
              const pct = users.length ? Math.round((s.count / users.length) * 100) : 0;
              return (
                <div key={s.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={s.text}>{s.icon}</span>
                      <span className="font-medium">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{s.count}</span>
                      <span className="text-xs font-semibold">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${s.color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recently Added</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                The latest team members
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(userRoutesConfig.list())}>
              View List
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentUsers.map((u) => {
                const role = roles.find((r) => r.id === u.roleId);
                return (
                  <button
                    key={u.id}
                    onClick={() => navigate(userRoutesConfig.details(u.id))}
                    className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-accent/50"
                  >
                    <Avatar name={u.name} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="hidden sm:block">
                      <Badge variant="outline">{role?.name}</Badge>
                    </div>
                    <div className="hidden text-right md:block">
                      <p className="text-xs text-muted-foreground">{timeAgo(u.createdAt)}</p>
                    </div>
                    <Badge variant={statusColor(u.status)}>{u.status}</Badge>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Activity Feed</CardTitle>
            {canViewLogs && (
              <Button variant="ghost" size="sm" onClick={() => navigate(logsRoutesConfig.root())}>
                All
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {recentLogs.map((log) => {
              const u = users.find((x) => x.id === log.userId);
              return (
                <div key={log.id} className="flex gap-3">
                  <Avatar name={u?.name || "?"} size={32} />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{u?.name || "Unknown"}</span>{" "}
                      <span className="text-muted-foreground">{log.action.toLowerCase()}</span>{" "}
                      <span className="font-medium">{log.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo(log.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
