import * as React from "react";
import {
  Activity,
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Key,
  Search,
  Download,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Select,
} from "@/components/ui";
import { useStore } from "@/store";
import { formatDateTime, timeAgo } from "@/lib/helpers";
import { useToast } from "@/components/ui/toast";
import { useUsersStore } from "@/modules/users";

const iconFor: Record<string, React.ReactNode> = {
  login: <LogIn size={14} />,
  logout: <LogOut size={14} />,
  create: <Plus size={14} />,
  update: <Pencil size={14} />,
  delete: <Trash2 size={14} />,
  permission: <Key size={14} />,
};

const colorFor: Record<string, string> = {
  login: "bg-emerald-500/10 text-emerald-500",
  logout: "bg-slate-500/10 text-slate-500",
  create: "bg-blue-500/10 text-blue-500",
  update: "bg-amber-500/10 text-amber-500",
  delete: "bg-red-500/10 text-red-500",
  permission: "bg-purple-500/10 text-purple-500",
};

export const ActivityLogs = () => {
  const { logs } = useStore();
  const { users } = useUsersStore();

  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("all");

  const filtered = logs
    .filter((l) => type === "all" || l.type === type)
    .filter((l) => {
      const s = search.toLowerCase();
      if (!s) return true;
      const u = users.find((x) => x.id === l.userId);
      return (
        l.action.toLowerCase().includes(s) ||
        l.target.toLowerCase().includes(s) ||
        (u?.name.toLowerCase().includes(s) ?? false)
      );
    });

  // Group by day
  const grouped = filtered.reduce<Record<string, typeof logs>>((acc, l) => {
    const day = new Date(l.timestamp).toDateString();
    (acc[day] ||= []).push(l);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Activity Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Full audit trail of actions across your workspace.
          </p>
        </div>
        <Button variant="outline" onClick={() => toast({ type: "success", title: "Exported logs" })}>
          <Download size={14} /> Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
          <div className="relative md:col-span-3">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search logs, users, targets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select
            value={type}
            onChange={setType}
            options={[
              { label: "All types", value: "all" },
              { label: "Login", value: "login" },
              { label: "Logout", value: "logout" },
              { label: "Create", value: "create" },
              { label: "Update", value: "update" },
              { label: "Delete", value: "delete" },
              { label: "Permission", value: "permission" },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {Object.entries(grouped).map(([day, dayLogs]) => (
            <div key={day}>
              <div className="sticky top-16 z-10 border-b border-border bg-muted/50 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
                {day === new Date().toDateString() ? "Today" : new Date(day).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </div>
              <div className="divide-y divide-border">
                {dayLogs.map((log) => {
                  const user = users.find((u) => u.id === log.userId);
                  return (
                    <div key={log.id} className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-accent/30">
                      <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorFor[log.type]}`}>
                        {iconFor[log.type] || <Activity size={14} />}
                      </div>
                      <Avatar name={user?.name || "?"} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-semibold">{user?.name || "Unknown"}</span>{" "}
                          <span className="text-muted-foreground">{log.action.toLowerCase()}</span>{" "}
                          <span className="font-medium">{log.target}</span>
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatDateTime(log.timestamp)}</span>
                          <span>·</span>
                          <span>{timeAgo(log.timestamp)}</span>
                          <span>·</span>
                          <span className="font-mono">{log.ip}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">{log.type}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-16 text-center text-sm text-muted-foreground">No activity logs found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
