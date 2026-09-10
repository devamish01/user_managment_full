import * as React from "react";
import { Save, Plus, Pencil, Trash2, LayoutGrid, List, Shield, Info } from "lucide-react";
import { useStore, isSuperAdmin } from "@/store";
import useRolesStore from "../store/roles.store";
import { useToastError } from "@/core/api/toastUtils";
import { SharedButton, SharedBadge, SharedModal, SharedInput, ErrorState } from "@/shared/components";
import { Card, CardContent, CardHeader, CardTitle, Label, Textarea, Switch } from "@/components/ui";
import { RolesSkeleton } from "../components/RolesSkeleton";
import { ModulePermsCard } from "../components/ModulePermsCard";
import type { Role } from "@/lib/types";

const gradients = [
  "from-violet-500 to-indigo-600", "from-blue-500 to-cyan-500", "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500", "from-fuchsia-500 to-pink-500", "from-slate-500 to-slate-700",
];

export const RoleAssignmentPage = () => {
  const { permissions } = useStore();
  const { roles, loading, error, getRoles, createRole, updateRole, deleteRole, updateRolePermissions } = useRolesStore();
  const { toastError, toastSuccess } = useToastError();
  const [view, setView] = React.useState<"card" | "list">("card");
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("");
  const role = roles.find(r => r.id === selectedRoleId);

  React.useEffect(() => {
    getRoles();
  }, [getRoles]);

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
    try {
      const res = await updateRolePermissions(role!.id, localPerms);
      toastSuccess(res);
      setDirty(false);
    } catch (e: any) {
      toastError(e, { title: "Error" });
    }
  };

  const handleCreate = async () => {
    try {
      const res = await createRole({ ...formState, permissionIds: [] });
      toastSuccess(res);
      setCreateOpen(false);
    } catch (e: any) {
      toastError(e, { title: "Error" });
    }
  };

  const handleEdit = async () => {
    try {
      const res = await updateRole(editRoleObj!.id, formState);
      toastSuccess(res);
      setEditRoleObj(null);
    } catch (e: any) {
      toastError(e, { title: "Error" });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteRole(deleteRoleObj!.id);
      const reassignedCount = result.data?.reassignedCount || 0;
      if (reassignedCount > 0) {
        toastSuccess({ success: true, message: `Role deleted. ${reassignedCount} user(s) moved to Default Viewer` });
      } else {
        toastSuccess({ success: true, message: "Role deleted" });
      }
      setDeleteRoleObj(null);
    } catch (e: any) {
      if (e.errorCode === "SYSTEM_ROLE_DELETE_NOT_ALLOWED") {
        toastError({ errorCode: "SYSTEM_ROLE_DELETE_NOT_ALLOWED", message: "System roles cannot be deleted." }, { title: "Error" });
      } else {
        toastError(e, { title: "Error" });
      }
    }
  };

  const grouped = permissions.reduce((acc: any, p) => {
    if (p.module.endsWith(" UI")) return acc;
    const base = p.module;
    const uiPerms = permissions.filter(x => x.module === `${base} UI`);
    acc[base] = { perms: permissions.filter(x => x.module === base), uiPerms };
    return acc;
  }, {});

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
    <div className="roles-module-page space-y-6">
      <div className="roles-module-header flex justify-between items-center">
        <h1 className="text-3xl font-bold">Role Assignment</h1>
        <div className="flex gap-2">
          <div className="flex border rounded-lg p-1 bg-muted/40">
            <button onClick={() => setView("card")} className={`p-1.5 rounded-md ${view === "card" ? "bg-background shadow-sm" : ""}`}><LayoutGrid size={14} /></button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-md ${view === "list" ? "bg-background shadow-sm" : ""}`}><List size={14} /></button>
          </div>
          <SharedButton onClick={() => setCreateOpen(true)}><Plus size={14} className="mr-2" /> Create Role</SharedButton>
          {dirty && !locked && <SharedButton onClick={save} variant="outline"><Save size={14} className="mr-2" /> Save</SharedButton>}
        </div>
      </div>

      <div className={view === "card" ? "roles-module-grid roles-module-card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" : "roles-module-grid roles-module-list-grid space-y-2"}>
        {roles.map(r => {
          const isSystemRole = r.createdBy === "SYSTEM";
          const isDefaultRole = r.id === "r4";
          return (
            <Card key={r.id} onClick={() => setSelectedRoleId(r.id)} className={`cursor-pointer transition-all ${r.id === selectedRoleId ? "ring-2 ring-primary" : "hover:bg-accent/40"}`}>
              <div className={`h-1.5 bg-gradient-to-r ${r.color}`} />
              <CardHeader className="flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${r.color} text-white`}><Shield size={14} /></div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  {isDefaultRole && (
                    <SharedBadge variant="secondary" className="text-xs">Default Role</SharedBadge>
                  )}
                </div>
                {!isSystemRole && (
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); setEditRoleObj(r); setFormState({ name: r.name, description: r.description, color: r.color }); }} className="p-1 hover:bg-accent rounded"><Pencil size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteRoleObj(r); }} className="p-1 hover:bg-accent rounded text-red-500"><Trash2 size={12} /></button>
                  </div>
                )}
              </CardHeader>
              <CardContent><p className="text-xs text-muted-foreground line-clamp-1">{r.description}</p></CardContent>
            </Card>
          );
        })}
      </div>

      {role && (
        <div className="roles-module-role-panel space-y-4">
          <Card className="overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${role.color}`} />
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h2 className="text-lg font-semibold">{role.name}</h2>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <SharedBadge variant="success">{localPerms.length} enabled</SharedBadge>
                {role.id === "r4" && (
                  <SharedBadge variant="secondary" className="text-xs">Default Role</SharedBadge>
                )}
              </div>
            </CardContent>
          </Card>
          {role.createdBy === "SYSTEM" && <div className="flex items-center gap-2 p-3 bg-amber-500/10 text-amber-500 rounded-lg text-xs"><Info size={14} /> System role - cannot be modified or deleted.</div>}
          <div className="roles-module-permission-list space-y-4">
            {Object.keys(grouped).map(mod => <ModulePermsCard key={mod} moduleName={mod} perms={grouped[mod].perms} uiPerms={grouped[mod].uiPerms} localPerms={localPerms} toggle={toggle} locked={locked} />)}
          </div>
        </div>
      )}

      <SharedModal open={createOpen} onClose={() => setCreateOpen(false)} size="md" title="Create Role">
        <div className="space-y-4"><div className="space-y-3"><Label>Name</Label><SharedInput value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} /><Label>Description</Label><Textarea value={formState.description} onChange={e => setFormState({ ...formState, description: e.target.value })} /><Label>Color</Label><div className="grid grid-cols-3 gap-2">{gradients.map((g) => (<button key={g} type="button" onClick={() => setFormState({ ...formState, color: g })} className={`h-8 rounded-lg border-2 transition-all ${formState.color === g ? "border-primary" : "border-transparent"}`} style={{ background: `linear-gradient(to right, ${g.replace("from-", "").replace("to-", "")})` }} title={g} />))}</div></div><div className="flex justify-end gap-2"><SharedButton variant="outline" onClick={() => setCreateOpen(false)}>Cancel</SharedButton><SharedButton onClick={handleCreate}>Create</SharedButton></div></div>
      </SharedModal>
      <SharedModal open={!!editRoleObj} onClose={() => setEditRoleObj(null)} size="md" title="Edit Role">
        <div className="space-y-4"><div className="space-y-3"><Label>Name</Label><SharedInput value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} /><Label>Description</Label><Textarea value={formState.description} onChange={e => setFormState({ ...formState, description: e.target.value })} /><Label>Color</Label><div className="grid grid-cols-3 gap-2">{gradients.map((g) => (<button key={g} type="button" onClick={() => setFormState({ ...formState, color: g })} className={`h-8 rounded-lg border-2 transition-all ${formState.color === g ? "border-primary" : "border-transparent"}`} style={{ background: `linear-gradient(to right, ${g.replace("from-", "").replace("to-", "")})` }} title={g} />))}</div></div><div className="flex justify-end gap-2"><SharedButton variant="outline" onClick={() => setEditRoleObj(null)}>Cancel</SharedButton><SharedButton onClick={handleEdit}>Save</SharedButton></div></div>
      </SharedModal>
      <SharedModal open={!!deleteRoleObj} onClose={() => setDeleteRoleObj(null)} size="sm" title="Delete Role?">
        <div className="space-y-4 text-center">
          <Trash2 size={40} className="mx-auto text-red-500" />
          <p className="text-sm text-muted-foreground">Users assigned to this role will automatically be moved to the Default Viewer role.</p>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <div className="flex justify-center gap-2">
            <SharedButton variant="outline" onClick={() => setDeleteRoleObj(null)}>Cancel</SharedButton>
            <SharedButton variant="destructive" onClick={handleDelete}>Delete</SharedButton>
          </div>
        </div>
      </SharedModal>
    </div>
  );
};
