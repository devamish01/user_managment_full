import * as React from "react";
import { Shield, Save, Lock, Eye, ShieldCheck, Info, Plus, Pencil, Trash2, LayoutGrid, List } from "lucide-react";
import { SharedBadge, SharedButton, SharedInput, SharedModal } from "@/shared/components";
import { Card, CardContent, CardHeader, CardTitle, Label, Switch, Textarea, Tabs } from "@/components/ui";

const gradients = [
  "from-violet-500 to-indigo-600", "from-blue-500 to-cyan-500", "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500", "from-fuchsia-500 to-pink-500", "from-slate-500 to-slate-700",
];

const moduleIcons: Record<string, React.ReactNode> = {
  "UI Visibility": <Eye size={14} />, "User Management": <Shield size={14} />,
  "Roles & Permissions": <ShieldCheck size={14} />, "Settings": <Lock size={14} />,
};

export const ModulePermsCard = ({ moduleName, perms, uiPerms, localPerms, toggle, locked }: any) => {
  const [tab, setTab] = React.useState(perms.length > 0 ? "perms" : "ui");
  const columnPerms = uiPerms.filter((p: any) => p.name.startsWith("Column:"));
  const tabPerms = uiPerms.filter((p: any) => p.name.startsWith("Tab:"));
  const sectionPerms = uiPerms.filter((p: any) => p.name.startsWith("Section:"));
  const filterPerms = uiPerms.filter((p: any) => p.name.startsWith("Filter:"));
  const togglePerms = uiPerms.filter((p: any) => p.name.startsWith("Toggle:"));
  const uncategorizedPerms = uiPerms.filter((p: any) => !p.name.includes(":"));

  const tabs = [];
  if (perms.length > 0) tabs.push({ value: "perms", label: "Permissions" });
  if (uiPerms.length > 0) tabs.push({ value: "ui", label: "UI Visibility" });

  const renderItem = (p: any) => (
    <div key={p.id} className={`flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors ${localPerms.includes(p.id) ? "border-primary/30 bg-primary/5" : "border-border"} ${locked ? "opacity-70" : ""}`}>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{p.name}</p>
        <code className="text-[10px] text-primary">{p.key}</code>
      </div>
      <Switch checked={localPerms.includes(p.id)} onCheckedChange={() => toggle(p.id)} disabled={locked} />
    </div>
  );

  return (
    <Card className={tabs.length > 1 ? "border-primary/20" : ""}>
      <CardHeader className="flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">{moduleIcons[moduleName] || <ShieldCheck size={18} />}</div><CardTitle className="text-base">{moduleName}</CardTitle></div>
        {tabs.length > 1 && <Tabs tabs={tabs} value={tab} onChange={setTab} />}
      </CardHeader>
      <CardContent>
        {tab === "perms" && <div className="grid grid-cols-1 gap-2 md:grid-cols-2">{perms.map(renderItem)}</div>}
        {tab === "ui" && (
          <div className="space-y-6">
            {columnPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Columns</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{columnPerms.map(renderItem)}</div></div>}
            {tabPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tabs</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{tabPerms.map(renderItem)}</div></div>}
            {sectionPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sections</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{sectionPerms.map(renderItem)}</div></div>}
            {filterPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filters</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{filterPerms.map(renderItem)}</div></div>}
            {togglePerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Toggles</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{togglePerms.map(renderItem)}</div></div>}
            {uncategorizedPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Other UI</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{uncategorizedPerms.map(renderItem)}</div></div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
