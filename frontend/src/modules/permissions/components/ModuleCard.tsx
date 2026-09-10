import * as React from "react";
import { Pencil, Trash2, Key, Activity, ToggleRight, Users, Settings as SettingsIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
} from "@/components/ui";
import type { Permission } from "@/lib/types";

const moduleIcons: Record<string, React.ReactNode> = {
  "Sidebar Navigation": <Activity size={18} />,
  "User Management": <Users size={18} />,
  "Role Assignment": <ToggleRight size={18} />,
  "Permissions": <Key size={18} />,
  "Activity Logs": <Activity size={18} />,
  "Settings": <SettingsIcon size={18} />,
  "Transaction Details": <Activity size={18} />,
};

export const ModuleCard = ({ moduleName, perms, uiPerms, onEdit, onDelete }: any) => {
  const [tab, setTab] = React.useState(perms.length > 0 ? "perms" : "ui");
  const columnPerms = uiPerms.filter((p: any) => p.name.startsWith("Column:"));
  const tabPerms = uiPerms.filter((p: any) => p.name.startsWith("Tab:"));
  const sectionPerms = uiPerms.filter((p: any) => p.name.startsWith("Section:"));
  const filterPerms = uiPerms.filter((p: any) => p.name.startsWith("Filter:"));
  const togglePerms = uiPerms.filter((p: any) => p.name.startsWith("Toggle:"));
  const buttonPerms = uiPerms.filter((p: any) => p.name.startsWith("Button:"));
  const uncategorizedPerms = uiPerms.filter((p: any) => !p.name.includes(":"));

  const tabs = [];
  if (perms.length > 0) tabs.push({ value: "perms", label: "Permissions" });
  if (uiPerms.length > 0) tabs.push({ value: "ui", label: "UI Visibility" });

  const renderPerm = (p: Permission) => (
    <div key={p.id} className="group flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/20 p-3 transition-all hover:border-primary/40 hover:bg-primary/5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{p.name}</p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <code className="inline-block rounded bg-background px-1.5 py-0.5 text-[10px] text-primary">{p.key}</code>
          {p.assignedRolesCount !== undefined && p.assignedRolesCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">
              <Users size={10} />
              Assigned to: {p.assignedRolesCount} Role{p.assignedRolesCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={() => onEdit(p)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent" title="Edit"><Pencil size={12} /></button>
        <button onClick={() => onDelete(p)} className="rounded-md p-1.5 text-red-500 hover:bg-red-500/10" title="Delete"><Trash2 size={12} /></button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{moduleIcons[moduleName] || <Key size={18} />}</div>
          <div><CardTitle className="text-base">{moduleName}</CardTitle></div>
        </div>
        {tabs.length > 1 && <Tabs tabs={tabs} value={tab} onChange={setTab} />}
      </CardHeader>
      <CardContent>
        {tab === "perms" && <div className="grid grid-cols-1 gap-2 md:grid-cols-2">{perms.map(renderPerm)}</div>}
        {tab === "ui" && (
          <div className="space-y-6">
            {columnPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Columns</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{columnPerms.map(renderPerm)}</div></div>}
            {tabPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tabs</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{tabPerms.map(renderPerm)}</div></div>}
            {sectionPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sections</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{sectionPerms.map(renderPerm)}</div></div>}
            {filterPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filters</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{filterPerms.map(renderPerm)}</div></div>}
            {togglePerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Toggles</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{togglePerms.map(renderPerm)}</div></div>}
            {buttonPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Buttons</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{buttonPerms.map(renderPerm)}</div></div>}
            {uncategorizedPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Other UI</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{uncategorizedPerms.map(renderPerm)}</div></div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
