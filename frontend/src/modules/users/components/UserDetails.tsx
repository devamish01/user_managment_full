/**
 * UserDetails — user profile page.
 * Uses shared components, utils, and hooks.
 */

import React from "react";
import { ArrowLeft, Pencil, Save, X, Calendar, Clock, Hash, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { useStore, useHasPermission } from "@/store";
import { statusToBadgeVariant } from "@/shared/utils/format";
import { formatFullDate, formatTime } from "@/shared/utils/date";
import { cn } from "@/shared/utils/cn";
import { SharedButton, SharedBadge } from "@/shared/components";
import { UserService } from "../services";
import type { Status, User } from "@/lib/types";
import useUsersStore from "@/modules/users/store";
export interface UserDetailsProps {
  id: string;
  onBack: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ id, onBack }) => {
  const { roles,  } = useStore();
  const { users,  updateUser, getUsers } = useUsersStore();
  const hasPermission = useHasPermission();

  const [remoteUser, setRemoteUser] = React.useState<User | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(false);
  const [userError, setUserError] = React.useState<string | null>(null);

  const user = users.find((u) => u.id === id) ?? remoteUser;
  const canEdit = hasPermission("users.update");

  // Resolve approver name from users list
  const approverName = React.useMemo(() => {
    if (!user?.approvedBy) return undefined;
    const approver = users.find((u) => u.id === user.approvedBy);
    return approver ? `${approver.firstName} ${approver.lastName}`.trim() : undefined;
  }, [user?.approvedBy, users]);

  // Create user object with resolved approver name
  const userWithApprover = React.useMemo(() => {
    if (!user) return user;
    return {
      ...user,
      approvedByName: approverName,
    };
  }, [user, approverName]);

  const displayUser = userWithApprover!;
  const role = roles.find((r) => r.id === displayUser?.roleId);

  const [isEditing, setIsEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    roleId: "",
    status: "active" as Status,
    location: "",
    jobTitle: "",
    address: "",
    bio: "",
  });

  React.useEffect(() => {
    if (displayUser) {
      setForm({
        firstName: displayUser.firstName || "",
        lastName: displayUser.lastName || "",
        email: displayUser.email || "",
        phone: displayUser.phone || "",
        username: displayUser.username || "",
        roleId: displayUser.roleId || "",
        status: displayUser.status,
        location: displayUser.location || "",
        jobTitle: displayUser.jobTitle || "",
        address: displayUser.address || "",
        bio: displayUser.bio || "",
      });
    }
  }, [displayUser]);

  React.useEffect(() => {
    setRemoteUser(null);
    setUserError(null);
  }, [id]);

  React.useEffect(() => {
    if (user || !id) return;

    setLoadingUser(true);
    setUserError(null);

    UserService.getUserById(id)
      .then((response) => {
        if (response.success && response.data) {
          setRemoteUser(response.data);
        } else {
          setUserError(response.message || "User not found.");
        }
      })
      .catch((error: unknown) => {
        setUserError(error instanceof Error ? error.message : "Failed to load user.");
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [id, user]);

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  if (!userWithApprover) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">{userError ?? "User not found."}</p>
        <SharedButton className="mt-4" onClick={onBack}>Back to users</SharedButton>
      </div>
    );
  }

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      return;
    }
    try {
      await updateUser(userWithApprover.id, form);
      await getUsers();
      setIsEditing(false);
    } catch (error: unknown) {
      console.error("Update failed", error);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: displayUser.firstName || "",
      lastName: displayUser.lastName || "",
      email: displayUser.email || "",
      phone: displayUser.phone || "",
      username: displayUser.username || "",
      roleId: displayUser.roleId || "",
      status: displayUser.status,
      location: displayUser.location || "",
      jobTitle: displayUser.jobTitle || "",
      address: displayUser.address || "",
      bio: displayUser.bio || "",
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
              <span>{displayUser.firstName ? `${displayUser.firstName[0]}${displayUser.lastName?.[0] || ""}`.toUpperCase() : "NU"}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{displayUser.firstName} {displayUser.lastName}</h2>
              {hasPermission("users.col_id") && <p className="text-xs font-mono text-muted-foreground">{displayUser.id}</p>}
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary/70 mb-2">Account Details</p>
                  <div className="h-px bg-border" />
                </div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">First Name</label><p className="text-lg font-medium">{displayUser.firstName}</p></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Last Name</label><p className="text-lg font-medium">{displayUser.lastName}</p></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">User ID</label><div className="font-mono text-sm bg-muted px-3 py-1.5 rounded-md w-fit">{displayUser.id}</div></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Email Address</label><p className="font-medium">{displayUser.email}</p></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Mobile Number</label><p className="font-medium">{displayUser.phone || "—"}</p></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Username</label><p className="font-medium">{displayUser.username || "—"}</p></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Location</label><p className="font-medium">{displayUser.location || "—"}</p></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Job Title</label><p className="font-medium">{displayUser.jobTitle || "—"}</p></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Address</label><p className="font-medium">{displayUser.address || "—"}</p></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Bio</label><p className="font-medium">{displayUser.bio || "—"}</p></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Role</label><div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full bg-gradient-to-r ${role?.color}`} /><span className="font-medium">{role?.name}</span></div></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Status</label><SharedBadge variant={statusToBadgeVariant(displayUser.status)} className="text-sm">{displayUser.status}</SharedBadge></div>
                {displayUser.status === "active" && displayUser.approvedAt && (
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <UserCheck size={14} className="text-emerald-500" /> Approved By
                    </label>
                    <p className="font-medium">
                      {displayUser.approvedByName || displayUser.approvedBy || "—"}
                    </p>
                  </div>
                )}
                {displayUser.status === "active" && displayUser.approvedAt && (
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={14} /> Approved At
                    </label>
                    <p className="font-medium">{formatFullDate(displayUser.approvedAt)}</p>
                  </div>
                )}
                <div className="space-y-1"><label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={14} /> Join Date</label><p className="font-medium">{formatFullDate(displayUser.createdAt)}</p></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={14} /> Join Time</label><p className="font-medium">{formatTime(displayUser.createdAt)}</p></div>
              </div>
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
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><label className="text-sm font-medium">First Name *</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Last Name *</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Email *</label><input type="email" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Mobile Number</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Username</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Location</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Job Title</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Role</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
                <div className="md:col-span-2 space-y-1.5"><label className="text-sm font-medium">Status</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}><option value="active">Active</option><option value="inactive">Inactive</option><option value="blocked">Blocked</option><option value="pending">Pending</option></select></div>
                <div className="md:col-span-2 space-y-1.5"><label className="text-sm font-medium">Address</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                <div className="md:col-span-2 space-y-1.5"><label className="text-sm font-medium">Bio</label><textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
              </div>
              <div className="border-t border-border pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Hash size={14} /><span>User ID (non-editable):</span><span className="font-mono text-foreground">{displayUser.id}</span></div>
                <div className="flex items-center gap-2 mt-1"><Calendar size={14} /><span>Joined on:</span><span className="font-medium text-foreground">{formatFullDate(displayUser.createdAt)} at {formatTime(displayUser.createdAt)}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground">User ID: <span className="font-mono text-foreground">{displayUser.id}</span> • Joined {formatFullDate(displayUser.createdAt)}</div>
    </div>
  );
};
