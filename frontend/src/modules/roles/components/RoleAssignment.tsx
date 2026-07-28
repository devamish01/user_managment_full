/**
 * Role Assignment Page
 */

import React from "react";
import { Shield, Save, Lock, Eye, ShieldCheck, Info, Plus, Pencil, Trash2, LayoutGrid, List } from "lucide-react";
import { useStore, isSuperAdmin } from "@/store";
import useRolesStore from "../store/roles.store";
import { useToast } from "@/components/ui/toast";
import { SharedButton, SharedBadge, SharedModal, SharedInput, ErrorState } from "@/shared/components";
import { Card, CardContent, CardHeader, CardTitle, Label, Switch, Textarea, Tabs } from "@/components/ui";
import { RolesSkeleton } from "./RolesSkeleton";
import type { Role } from "@/lib/types";

const gradients = [
  "from-violet-500 to-indigo-600", "from-blue-500 to-cyan-500", "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500", "from-fuchsia-500 to-pink-500", "from-slate-500 to-slate-700",
];

const moduleIcons: Record<string, React.ReactNode> = {
  "UI Visibility": <Eye size={14} />, "User Management": <Shield size={14} />,
  "Roles & Permissions": <ShieldCheck size={14} />, "Settings": <Lock size={14} />,
};

const ModulePermsCard = ({ moduleName, perms, uiPerms, localPerms, toggle, locked }: any) => {
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

export const RoleAssignment = () => {
  const { permissions } = useStore();
  const { roles, loading, error, getRoles, createRole, updateRole, deleteRole, updateRolePermissions } = useRolesStore();
  const { toast } = useToast();
  const [view, setView] = React.useState<"card" | "list">("card");
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("");
  const role = roles.find(r => r.id === selectedRoleId);

  // Fetch roles on mount
  React.useEffect(() => {
    getRoles();
  }, [getRoles]);

  // Initialise selectedRoleId once roles are loaded — without this, refreshing
  // the page leaves the selection empty because roles starts as [].
  React.useEffect(() => {
    if (!selectedRoleId && roles.length > 0) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);
  const [localPerms, setLocalPerms] = React.useState<string[]>(role?.permissionIds || []);
  const [dirty, setDirty] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editRoleObj, setEditRoleObj] = React.useState<Role | null>(null);
  const [deleteRoleObj, setDeleteRoleObj] = React.useState<Role | null>(null);
  const [formState, setFormState] = React.useState({ name: "", description: "", color: gradients[1] });
  const locked = isSuperAdmin(selectedRoleId);

  React.useEffect(() => { setLocalPerms(role?.permissionIds || []); setDirty(false); }, [selectedRoleId, role?.permissionIds]);

  const toggle = (pid: string) => { if (!locked) { setLocalPerms(prev => prev.includes(pid) ? prev.filter(x => x !== pid) : [...prev, pid]); setDirty(true); } };

  const save = async () => {
    try { await updateRolePermissions(role!.id, localPerms); toast({ type: "success", title: "Permissions saved" }); setDirty(false); }
    catch (e: any) { toast({ type: "error", title: "Error", description: e.message }); }
  };

  const handleCreate = async () => {
    try { await createRole({ ...formState, permissionIds: [] }); toast({ type: "success", title: "Role created" }); setCreateOpen(false); }
    catch (e: any) { toast({ type: "error", title: "Error", description: e.message }); }
  };

  const handleEdit = async () => {
    try { await updateRole(editRoleObj!.id, formState); toast({ type: "success", title: "Role updated" }); setEditRoleObj(null); }
    catch (e: any) { toast({ type: "error", title: "Error", description: e.message }); }
  };

  const handleDelete = async () => {
    try { await deleteRole(deleteRoleObj!.id); toast({ type: "success", title: "Role deleted" }); setDeleteRoleObj(null); }
    catch (e: any) { toast({ type: "error", title: "Error", description: e.message }); }
  };

  const grouped = permissions.reduce((acc: any, p) => {
    if (p.module.endsWith(" UI")) return acc;
    const base = p.module;
    const uiPerms = permissions.filter(x => x.module === `${base} UI`);
    acc[base] = { perms: permissions.filter(x => x.module === base), uiPerms };
    return acc;
  }, {});

  // ── Standard page lifecycle ──
  if (loading) return <RolesSkeleton />;
  if (error) {
    return (
      <ErrorState
        title="Unable to load roles"
        description={error}
        onRetry={getRoles}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Role Assignment</h1>
        <div className="flex gap-2">
          <div className="flex border rounded-lg p-1 bg-muted/40">
            <button onClick={() => setView("card")} className={`p-1.5 rounded-md ${view === "card" ? "bg-background shadow-sm" : ""}`}><LayoutGrid size={14}/></button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-md ${view === "list" ? "bg-background shadow-sm" : ""}`}><List size={14}/></button>
          </div>
          <SharedButton onClick={() => setCreateOpen(true)}><Plus size={14} className="mr-2"/> Create Role</SharedButton>
          {dirty && !locked && <SharedButton onClick={save} variant="outline"><Save size={14} className="mr-2"/> Save</SharedButton>}
        </div>
      </div>

      <div className={view === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" : "space-y-2"}>
        {roles.map(r => (
          <Card key={r.id} onClick={() => setSelectedRoleId(r.id)} className={`cursor-pointer transition-all ${r.id === selectedRoleId ? "ring-2 ring-primary" : "hover:bg-accent/40"}`}>
            <div className={`h-1.5 bg-gradient-to-r ${r.color}`}/>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2"><div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${r.color} text-white`}><Shield size={14}/></div><p className="font-semibold text-sm">{r.name}</p></div>
              {!isSuperAdmin(r.id) && (
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setEditRoleObj(r); setFormState({ name: r.name, description: r.description, color: r.color }); }} className="p-1 hover:bg-accent rounded"><Pencil size={12}/></button>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteRoleObj(r); }} className="p-1 hover:bg-accent rounded text-red-500"><Trash2 size={12}/></button>
                </div>
              )}
            </CardHeader>
            <CardContent><p className="text-xs text-muted-foreground line-clamp-1">{r.description}</p></CardContent>
          </Card>
        ))}
      </div>

      {role && (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${role.color}`} />
            <CardContent className="flex justify-between items-center p-4">
              <div><h2 className="text-lg font-semibold">{role.name}</h2><p className="text-sm text-muted-foreground">{role.description}</p></div>
              <SharedBadge variant="success">{localPerms.length} enabled</SharedBadge>
            </CardContent>
          </Card>
          {locked && <div className="flex items-center gap-2 p-3 bg-amber-500/10 text-amber-500 rounded-lg text-xs"><Info size={14}/> Super Admin permissions are fixed.</div>}
          <div className="space-y-4">
            {Object.keys(grouped).map(mod => <ModulePermsCard key={mod} moduleName={mod} perms={grouped[mod].perms} uiPerms={grouped[mod].uiPerms} localPerms={localPerms} toggle={toggle} locked={locked} />)}
          </div>
        </div>
      )}

      <SharedModal open={createOpen} onClose={() => setCreateOpen(false)} size="md" title="Create Role">
        <div className="space-y-4"><div className="space-y-3"><Label>Name</Label><SharedInput value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})}/><Label>Description</Label><Textarea value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})}/></div><div className="flex justify-end gap-2"><SharedButton variant="outline" onClick={() => setCreateOpen(false)}>Cancel</SharedButton><SharedButton onClick={handleCreate}>Create</SharedButton></div></div>
      </SharedModal>
      <SharedModal open={!!editRoleObj} onClose={() => setEditRoleObj(null)} size="md" title="Edit Role">
        <div className="space-y-4"><div className="space-y-3"><Label>Name</Label><SharedInput value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})}/><Label>Description</Label><Textarea value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})}/></div><div className="flex justify-end gap-2"><SharedButton variant="outline" onClick={() => setEditRoleObj(null)}>Cancel</SharedButton><SharedButton onClick={handleEdit}>Save</SharedButton></div></div>
      </SharedModal>
      <SharedModal open={!!deleteRoleObj} onClose={() => setDeleteRoleObj(null)} size="sm" title="Delete Role?">
        <div className="space-y-4 text-center"><Trash2 size={40} className="mx-auto text-red-500"/><div className="flex justify-center gap-2"><SharedButton variant="outline" onClick={() => setDeleteRoleObj(null)}>Cancel</SharedButton><SharedButton variant="destructive" onClick={handleDelete}>Delete</SharedButton></div></div>
      </SharedModal>
    </div>
  );
};
