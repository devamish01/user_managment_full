import * as React from "react";
import { Plus, Pencil, Trash2, Key, Activity, ToggleRight, Users, Settings as SettingsIcon } from "lucide-react";
import {
  Label,
  Textarea,
  Select,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
} from "@/components/ui";
import { SharedButton, SharedInput, SharedModal, SharedSearch, ErrorState } from "@/shared/components";
import { useToast } from "@/components/ui/toast";
import usePermissionsStore from "../store/permissions.store";
import { PermissionsSkeleton } from "./PermissionsSkeleton";
import type { Permission } from "@/lib/types";

const moduleIcons: Record<string, React.ReactNode> = {
  "Sidebar Navigation": <Activity size={18} />,
  "User Management": <Users size={18} />,
  "Role Assignment": <ToggleRight size={18} />,
  "Permissions": <Key size={18} />,
  "Activity Logs": <Activity size={18} />,
  "Settings": <SettingsIcon size={18} />,
};

const ModuleCard = ({ moduleName, perms, uiPerms, onEdit, onDelete }: any) => {
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
            {uncategorizedPerms.length > 0 && <div><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Other UI</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{uncategorizedPerms.map(renderPerm)}</div></div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const Permissions = () => {
  const { permissions, loading, error, getPermissions, createPermission, updatePermission, deletePermission } = usePermissionsStore();
  const { toast } = useToast();
  const [editing, setEditing] = React.useState<Permission | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deletePerm, setDeletePerm] = React.useState<Permission | null>(null);
  const [search, setSearch] = React.useState("");

  const baseModules = Array.from(new Set(permissions.map(p => p.module.replace(/ UI$/, ""))));

  React.useEffect(() => { getPermissions(); }, []);

  const save = async () => {
    if (!editing) return;
    try {
      // Client-side validation for key format (lowercase letters and dots only)
      if (creating && editing.key && !/^[a-z.]+$/.test(editing.key)) {
        toast({ type: "error", title: "Invalid Key", description: "Key must contain only lowercase letters and dots (e.g. users.create)" });
        return;
      }
      // Don't send key when updating (key cannot be edited)
      // Don't send id when creating (backend generates it)
      const data = creating
        ? { name: editing.name, key: editing.key, module: editing.module, description: editing.description }
        : { ...editing, key: undefined, id: undefined };
      console.log("Permissions.tsx save - creating:", creating, "data:", data);
      if (creating) { await createPermission(data); toast({ type: "success", title: "Permission created" }); }
      else { await updatePermission(editing.id, data); toast({ type: "success", title: "Permission updated" }); }
      setEditing(null); setCreating(false);
    } catch (e: any) { toast({ type: "error", title: "Error", description: e.message }); }
  };

  const confirmDelete = async () => {
    try { await deletePermission(deletePerm!.id); toast({ type: "success", title: "Permission deleted" }); setDeletePerm(null); }
    catch (e: any) { toast({ type: "error", title: "Cannot Delete", description: e.message }); }
  };

  const grouped = permissions.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).reduce((acc: any, p) => {
    const base = p.module.replace(/ UI$/, "");
    if (!acc[base]) acc[base] = { perms: [], uiPerms: [] };
    if (p.module.endsWith(" UI")) acc[base].uiPerms.push(p); else acc[base].perms.push(p);
    return acc;
  }, {});

  // ── Standard page lifecycle ──
  if (loading) return <PermissionsSkeleton />;
  if (error) {
    return (
      <ErrorState
        title="Unable to load permissions"
        description={error}
        onRetry={getPermissions}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Permissions</h1>
        <SharedButton onClick={() => { setEditing({ name: "", key: "", module: baseModules[0] || "Settings", description: "" }); setCreating(true); }}><Plus size={14} className="mr-2"/> New Permission</SharedButton>
      </div>
      <Card><CardContent className="p-4"><SharedSearch value={search} onChange={setSearch} placeholder="Search permissions..."/></CardContent></Card>
      <div className="space-y-4">{Object.keys(grouped).map(key => <ModuleCard key={key} moduleName={key} perms={grouped[key].perms} uiPerms={grouped[key].uiPerms} onEdit={(p: Permission) => { setEditing(p); setCreating(false); }} onDelete={(p: Permission) => setDeletePerm(p)} />)}</div>
      
      <SharedModal open={!!editing} onClose={() => { setEditing(null); setCreating(false); }} size="md" title={creating ? "Create Permission" : "Edit Permission"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Name</Label><SharedInput value={editing?.name} onChange={e => setEditing({ ...editing!, name: e.target.value })}/></div>
            <div className="space-y-1.5"><Label>Module</Label><Select value={editing?.module || ""} onChange={(v: string) => setEditing({ ...editing!, module: v })} options={[...baseModules.map(m => ({ label: m, value: m })), ...baseModules.map(m => ({ label: `${m} UI`, value: `${m} UI` }))]} /></div>
            <div className="space-y-1.5 col-span-2"><Label>Key</Label><SharedInput value={editing?.key} onChange={e => setEditing({ ...editing!, key: e.target.value })} disabled={!creating} className={!creating ? "bg-muted" : ""} placeholder={creating ? "e.g. users.create, permissions.view" : "Key cannot be edited after creation"}/><p className="text-xs text-muted-foreground">Lowercase letters and dots only (e.g. users.create)</p></div>
            <div className="space-y-1.5 col-span-2"><Label>Description</Label><Textarea value={editing?.description} onChange={e => setEditing({ ...editing!, description: e.target.value })}/></div>
          </div>
          <div className="flex justify-end gap-2"><SharedButton variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Cancel</SharedButton><SharedButton onClick={save}>{creating ? "Create" : "Save"}</SharedButton></div>
        </div>
      </SharedModal>

      <SharedModal open={!!deletePerm} onClose={() => setDeletePerm(null)} size="sm" title="Delete Permission?">
        <div className="space-y-4 text-center">
          <Trash2 size={40} className="mx-auto text-red-500"/>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deletePerm?.name}</strong>?</p>
          {deletePerm && deletePerm.assignedRolesCount && deletePerm.assignedRolesCount > 0 && (
            <p className="text-sm text-red-500">
              <Users size={12} className="inline mr-1" />
              This permission is assigned to {deletePerm.assignedRolesCount} role{deletePerm.assignedRolesCount !== 1 ? "s" : ""}. It cannot be deleted until removed from all roles.
            </p>
          )}
          <div className="flex justify-center gap-2"><SharedButton variant="outline" onClick={() => setDeletePerm(null)}>Cancel</SharedButton><SharedButton variant="destructive" onClick={confirmDelete} disabled={deletePerm && deletePerm.assignedRolesCount && deletePerm.assignedRolesCount > 0}>Delete</SharedButton></div>
        </div>
      </SharedModal>
    </div>
  );
};
