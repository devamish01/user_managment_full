import * as React from "react";
import { Plus } from "lucide-react";
import { SharedButton, SharedSearch, ErrorState } from "@/shared/components";
import { Card, CardContent } from "@/components/ui";
import { useToastError } from "@/core/api/toastUtils";
import usePermissionsStore from "../store/permissions.store";
import { PermissionsSkeleton } from "../components/PermissionsSkeleton";
import { ModuleCard } from "../components/ModuleCard";
import { PermissionFormModal } from "../components/PermissionFormModal";
import { DeletePermissionModal } from "../components/DeletePermissionModal";
import type { Permission } from "@/lib/types";

export const PermissionsPage = () => {
  const { permissions, loading, error, getPermissions, createPermission, updatePermission, deletePermission } = usePermissionsStore();
  const { toastError, toastSuccess } = useToastError();
  const [editing, setEditing] = React.useState<Partial<Permission> | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deletePerm, setDeletePerm] = React.useState<Permission | null>(null);
  const [search, setSearch] = React.useState("");

  const baseModules = Array.from(new Set(permissions.map(p => p.module.replace(/ UI$/, ""))));

  React.useEffect(() => { getPermissions(); }, [getPermissions]);

  const save = async () => {
    if (!editing) return;
    try {
      if (creating && editing.key && !/^[a-z.]+$/.test(editing.key)) {
        toastError({ message: "Key must contain only lowercase letters and dots (e.g. users.create)" }, { title: "Invalid Key" });
        return;
      }

      const data = creating
        ? { name: editing.name!, key: editing.key!, module: editing.module!, description: editing.description! }
        : { name: editing.name!, module: editing.module!, description: editing.description!, key: editing.key! };

      if (creating) {
        const res = await createPermission(data);
        toastSuccess(res);
      } else {
        const res = await updatePermission(editing.id!, data);
        toastSuccess(res);
      }
      setEditing(null);
      setCreating(false);
    } catch (e: any) {
      toastError(e, { title: "Error" });
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await deletePermission(deletePerm!.id);
      toastSuccess(res);
      setDeletePerm(null);
    } catch (e: any) {
      toastError(e, { title: "Cannot Delete" });
    }
  };

  const grouped = permissions.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).reduce((acc: any, p) => {
    const base = p.module.replace(/ UI$/, "");
    if (!acc[base]) acc[base] = { perms: [], uiPerms: [] };
    if (p.module.endsWith(" UI")) acc[base].uiPerms.push(p); else acc[base].perms.push(p);
    return acc;
  }, {});

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
    <div className="permissions-module-page space-y-6">
      <div className="permissions-module-header flex justify-between items-center">
        <h1 className="text-3xl font-bold">Permissions</h1>
        <SharedButton onClick={() => { setEditing({ name: "", key: "", module: baseModules[0] || "Settings", description: "" }); setCreating(true); }}><Plus size={14} className="mr-2"/> New Permission</SharedButton>
      </div>
      <Card><CardContent className="p-4"><SharedSearch value={search} onChange={setSearch} placeholder="Search permissions..." /></CardContent></Card>
      <div className="permissions-module-list space-y-4">{Object.keys(grouped).map(key => <ModuleCard key={key} moduleName={key} perms={grouped[key].perms} uiPerms={grouped[key].uiPerms} onEdit={(p: Permission) => { setEditing(p); setCreating(false); }} onDelete={(p: Permission) => setDeletePerm(p)} />)}</div>

      <PermissionFormModal
        open={!!editing}
        creating={creating}
        editing={editing}
        baseModules={baseModules}
        onClose={() => { setEditing(null); setCreating(false); }}
        onChange={setEditing}
        onSave={save}
      />

      <DeletePermissionModal permission={deletePerm} onClose={() => setDeletePerm(null)} onConfirm={confirmDelete} />
    </div>
  );
};
