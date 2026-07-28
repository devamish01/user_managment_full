/**
 * UserDetails — user profile page.
 * Uses shared components, utils, and hooks.
 */

import React from "react";
import { ArrowLeft, Pencil, Save, X, Calendar, Clock, Hash, Lock, ShieldCheck } from "lucide-react";
import { useStore, useHasPermission } from "@/store";
import { statusToBadgeVariant } from "@/shared/utils/format";
import { formatFullDate, formatTime } from "@/shared/utils/date";
import { cn } from "@/shared/utils/cn";
import { SharedButton, SharedBadge } from "@/shared/components";
import type { Status } from "@/lib/types";
import useUsersStore from "@/modules/users/store";
export interface UserDetailsProps {
  id: string;
  onBack: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ id, onBack }) => {
  const { roles,  } = useStore();
  const { users,  updateUser, getUsers } = useUsersStore();
  const hasPermission = useHasPermission();

  const user = users.find((u) => u.id === id);
  const canEdit = hasPermission("users.update");

  const [isEditing, setIsEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    roleId: "",
    status: "active" as Status,
  });

  React.useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        status: user.status,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">User not found.</p>
        <SharedButton className="mt-4" onClick={onBack}>Back to users</SharedButton>
      </div>
    );
  }

  const role = roles.find((r) => r.id === user.roleId);

  const handleSave = async () => {
    if (!form.name || !form.email) {
      return;
    }
    try {
      await updateUser(user.id, form);
      await getUsers();
      setIsEditing(false);
    } catch (error: any) {
      console.error("Update failed", error);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      status: user.status,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SharedButton variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Users List
        </SharedButton>
      </div>
      <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-semibold text-white ring-4 ring-card from-indigo-500 to-purple-500 w-16 h-16 text-xl")}>
              <span>{user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              {hasPermission("users.col_id") && <p className="text-xs font-mono text-muted-foreground">{user.id}</p>}
            </div>
          </div>
          {!isEditing && canEdit && (
            <SharedButton variant="outline" onClick={() => setIsEditing(true)}><Pencil size={14} className="mr-2" /> Edit User</SharedButton>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <SharedButton variant="outline" onClick={handleCancel}><X size={14} className="mr-2" /> Cancel</SharedButton>
              <SharedButton onClick={handleSave}><Save size={14} className="mr-2" /> Save Changes</SharedButton>
            </div>
          )}
        </div>
        <div className="p-6 pt-0 space-y-8">
          {!isEditing ? (
            <div className="space-y-8 animate-in">
              {hasPermission("users.sec_details") ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary/70 mb-2">Account Details</p>
                    <div className="h-px bg-border" />
                  </div>
                  {hasPermission("users.col_name") && <div className="space-y-1"><label className="text-xs text-muted-foreground">User Name</label><p className="text-lg font-medium">{user.name}</p></div>}
                  {hasPermission("users.col_id") && <div className="space-y-1"><label className="text-xs text-muted-foreground">User ID</label><div className="font-mono text-sm bg-muted px-3 py-1.5 rounded-md w-fit">{user.id}</div></div>}
                  {hasPermission("users.col_email") && <div className="space-y-1"><label className="text-xs text-muted-foreground">Email Address</label><p className="font-medium">{hasPermission("users.view_full_email") ? user.email : user.email.replace(/^([^@])(.*)(@.*)$/, (_m, f, _mid, r) => f + "***" + r)}</p></div>}
                  {hasPermission("users.col_mobile") && <div className="space-y-1"><label className="text-xs text-muted-foreground">Mobile Number</label><p className="font-medium">{user.phone || "—"}</p></div>}
                  {hasPermission("users.col_role") && <div className="space-y-1"><label className="text-xs text-muted-foreground">Role</label><div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full bg-gradient-to-r ${role?.color}`} /><span className="font-medium">{role?.name}</span></div></div>}
                  {hasPermission("users.col_status") && <div className="space-y-1"><label className="text-xs text-muted-foreground">Status</label><SharedBadge variant={statusToBadgeVariant(user.status)} className="text-sm">{user.status}</SharedBadge></div>}
                  <div className="space-y-1"><label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={14} /> Join Date</label><p className="font-medium">{formatFullDate(user.createdAt)}</p></div>
                  <div className="space-y-1"><label className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={14} /> Join Time</label><p className="font-medium">{formatTime(user.createdAt)}</p></div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl">You don't have permission to view Account Details.</div>
              )}
              {hasPermission("users.sec_security") && (
                <div className="space-y-4">
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary/70 mb-2">Security & Privacy</p>
                    <div className="h-px bg-border" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><ShieldCheck size={18} className="text-emerald-500" /><div><p className="text-sm font-medium">Two-Factor Auth</p><p className="text-xs text-muted-foreground">Enabled via Authenticator</p></div></div><SharedBadge variant="success">Active</SharedBadge></div>
                    <div className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><Lock size={18} className="text-blue-500" /><div><p className="text-sm font-medium">Last Login</p><p className="text-xs text-muted-foreground">2 hours ago (San Francisco, US)</p></div></div></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><label className="text-sm font-medium">Name</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Email</label><input type="email" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Mobile Number</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Role</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
                <div className="md:col-span-2 space-y-1.5"><label className="text-sm font-medium">Status</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}><option value="active">Active</option><option value="inactive">Inactive</option><option value="blocked">Blocked</option></select></div>
              </div>
              <div className="border-t border-border pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Hash size={14} /><span>User ID (non-editable):</span><span className="font-mono text-foreground">{user.id}</span></div>
                <div className="flex items-center gap-2 mt-1"><Calendar size={14} /><span>Joined on:</span><span className="font-medium text-foreground">{formatFullDate(user.createdAt)} at {formatTime(user.createdAt)}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground">User ID: <span className="font-mono text-foreground">{user.id}</span> • Joined {formatFullDate(user.createdAt)}</div>
    </div>
  );
};
