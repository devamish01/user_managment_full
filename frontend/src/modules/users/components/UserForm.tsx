/**
 * UserForm — form for creating/editing a user.
 * Uses shared components and hooks.
 */

import React from "react";
import { ArrowLeft, Save, X, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { useToast } from "@/components/ui/toast";
import { SharedButton } from "@/shared/components";
import { cn } from "@/shared/utils/cn";
import { useUserForm } from "../hooks/useUserForm";
import { UserService } from "../services";
import type { Status, User } from "@/lib/types";
import { userRoutesConfig } from "../routes";
import { useAuth } from "@/modules/auth/hooks";

export interface UserFormProps {
  id?: string;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ id, onCancel }) => {
  const { users, roles, getUsers, createUser, updateUser, addLog } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser: authUser } = useAuth();

  const editing = id ? users.find((u) => u.id === id) : undefined;
  const [remoteUser, setRemoteUser] = React.useState<User | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(false);
  const [userError, setUserError] = React.useState<string | null>(null);

  const currentUserData = editing ?? remoteUser;
  const isRequesterSuperAdmin = authUser?.roleId === "r1";
  const { form, setField } = useUserForm(roles[0]?.id || "");

  // Initialize form when editing
  React.useEffect(() => {
    if (currentUserData) {
      setField("firstName", currentUserData.firstName);
      setField("lastName", currentUserData.lastName);
      setField("email", currentUserData.email);
      setField("phone", currentUserData.phone);
      setField("username", currentUserData.username);
      setField("roleId", currentUserData.roleId);
      setField("status", currentUserData.status);
      setField("location", currentUserData.location);
      setField("address", currentUserData.address);
      setField("bio", currentUserData.bio);
      setField("jobTitle", currentUserData.jobTitle);
      setField("isProtected", currentUserData.isProtected || false);
    }
  }, [currentUserData, setField]);

  React.useEffect(() => {
    if (!id || editing) return;

    setRemoteUser(null);
    setUserError(null);
    setLoadingUser(true);

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
  }, [id, editing]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      toast({ type: "error", title: "Missing fields", description: "First name, last name and email are required." });
      return;
    }
    if (!currentUserData && !form.password) {
      toast({ type: "error", title: "Missing fields", description: "Password is required for new users." });
      return;
    }

    try {
      if (currentUserData) {
        const { password, ...updatePayload } = form;
        // Only include isProtected in the update if the current user is a Super Admin
        const finalPayload = isRequesterSuperAdmin
          ? updatePayload
          : (({ isProtected, ...rest }) => rest)(updatePayload);
        await updateUser(currentUserData.id, finalPayload);
        addLog({ userId: users[0]?.id || "u", action: "Updated profile", target: `${form.firstName} ${form.lastName}`, type: "update" });
        await getUsers();
        toast({ type: "success", title: "User updated", description: `${form.firstName} ${form.lastName}'s profile has been saved.` });
      } else {
        await createUser(form);
        addLog({ userId: users[0]?.id || "u", action: "Created user", target: `${form.firstName} ${form.lastName}`, type: "create" });
        await getUsers();
        toast({ type: "success", title: "User created", description: `${form.firstName} ${form.lastName} has been added.` });
      }
      navigate(userRoutesConfig.list());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast({
        type: "error",
        title: editing ? "Update failed" : "Create failed",
        description: message,
      });
    }
  };

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">{userError}</p>
        <SharedButton className="mt-4" onClick={onCancel}>Back</SharedButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SharedButton variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft size={14} /> Back
        </SharedButton>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{editing ? "Edit User" : "Create User"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{editing ? "Update the profile information for this user." : "Add a new team member to your workspace."}</p>
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6"><h3 className="text-lg font-semibold leading-none tracking-tight">Basic Information</h3></div>
            <div className="p-6 pt-0 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5"><label className="text-sm font-medium">First Name *</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Last Name *</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Email *</label><input type="email" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.email} onChange={(e) => setField("email", e.target.value)} /></div>
              {!editing && (
                <div className="space-y-1.5"><label className="text-sm font-medium">Username (optional)</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.username || ""} onChange={(e) => setField("username", e.target.value)} placeholder="Auto-generated from name if empty" /></div>
              )}
              {!editing && (
                <div className="space-y-1.5"><label className="text-sm font-medium">Password *</label><input type="password" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.password || ""} onChange={(e) => setField("password", e.target.value)} /></div>
              )}
              <div className="space-y-1.5"><label className="text-sm font-medium">Mobile</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.phone} onChange={(e) => setField("phone", e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Location</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.location || ""} onChange={(e) => setField("location", e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Job Title</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.jobTitle || ""} onChange={(e) => setField("jobTitle", e.target.value)} /></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Address</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.address || ""} onChange={(e) => setField("address", e.target.value)} /></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Bio</label><textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.bio || ""} onChange={(e) => setField("bio", e.target.value)} /></div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6"><h3 className="text-lg font-semibold leading-none tracking-tight">Work Details</h3></div>
            <div className="p-6 pt-0 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5"><label className="text-sm font-medium">Role</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.roleId} onChange={(e) => setField("roleId", e.target.value)}>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Status</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.status} onChange={(e) => setField("status", e.target.value as Status)}><option value="active">Active</option><option value="inactive">Inactive</option><option value="blocked">Blocked</option><option value="pending">Pending</option></select></div>
              {isRequesterSuperAdmin && editing && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Shield size={14} className="text-amber-500" />
                    Protected User
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border accent-primary"
                      checked={currentUserData?.isProtected || false}
                      onChange={(e) => setField("isProtected", e.target.checked)}
                    />
                    <span className="text-sm text-muted-foreground">Prevent modification/deletion by non-Super Admins</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6"><h3 className="text-lg font-semibold leading-none tracking-tight">Preview</h3></div>
            <div className="p-6 pt-0 flex flex-col items-center text-center">
              <div className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-semibold text-white ring-2 ring-background from-indigo-500 to-purple-500", `w-20 h-20 text-2xl`)}>
                <span>{form.firstName ? `${form.firstName[0]}${form.lastName?.[0] || ""}`.toUpperCase() : "NU"}</span>
              </div>
              <p className="mt-3 font-semibold">{form.firstName || ""} {form.lastName || ""}</p>
              <p className="text-sm text-muted-foreground">{form.email || "email@company.io"}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SharedButton type="submit" size="lg"><Save size={14} /> {editing ? "Save Changes" : "Create User"}</SharedButton>
            <SharedButton type="button" variant="outline" size="lg" onClick={onCancel}><X size={14} /> Cancel</SharedButton>
          </div>
        </div>
      </form>
    </div>
  );
};
