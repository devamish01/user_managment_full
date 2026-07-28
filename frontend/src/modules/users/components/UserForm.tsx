/**
 * UserForm — form for creating/editing a user.
 * Uses shared components and hooks.
 */

import React from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { useToast } from "@/components/ui/toast";
import { SharedButton } from "@/shared/components";
import { cn } from "@/shared/utils/cn";
import { useUserForm } from "../hooks/useUserForm";
import { userRoutesConfig } from "../routes";
import type { Status } from "@/lib/types";

export interface UserFormProps {
  id?: string;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ id, onCancel }) => {
  const { users, roles, departments, getUsers, createUser, updateUser, addLog } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const editing = id ? users.find((u) => u.id === id) : undefined;
  const { form, setField } = useUserForm(roles[0]?.id || "");

  // Initialize form when editing
  React.useEffect(() => {
    if (editing) {
      setField("name", editing.name);
      setField("email", editing.email);
      setField("phone", editing.phone);
      setField("roleId", editing.roleId);
      setField("status", editing.status);
    }
  }, [editing]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ type: "error", title: "Missing fields", description: "Name and email are required." });
      return;
    }
    try {
      if (editing) {
        await updateUser(editing.id, form);
        addLog({ userId: users[0]?.id || "u", action: "Updated profile", target: form.name, type: "update" });
        await getUsers();
        toast({ type: "success", title: "User updated", description: `${form.name}'s profile has been saved.` });
      } else {
        await createUser({
          ...form,
          departmentId: departments[0]?.id || "",
          jobTitle: "",
          location: "",
          address: "",
          bio: "",
        });
        addLog({ userId: users[0]?.id || "u", action: "Created user", target: form.name, type: "create" });
        await getUsers();
        toast({ type: "success", title: "User created", description: `${form.name} has been added.` });
      }
      navigate(userRoutesConfig.list());
    } catch (error: any) {
      toast({
        type: "error",
        title: editing ? "Update failed" : "Create failed",
        description: error.message || "Please try again.",
      });
    }
  };

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
              <div className="space-y-1.5"><label className="text-sm font-medium">Full Name *</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.name} onChange={(e) => setField("name", e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Email *</label><input type="email" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.email} onChange={(e) => setField("email", e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Mobile</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.phone} onChange={(e) => setField("phone", e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Location</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.location || ""} onChange={(e) => setField("location" as any, e.target.value)} /></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Address</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.address || ""} onChange={(e) => setField("address" as any, e.target.value)} /></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Bio</label><textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.bio || ""} onChange={(e) => setField("bio" as any, e.target.value)} /></div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6"><h3 className="text-lg font-semibold leading-none tracking-tight">Work Details</h3></div>
            <div className="p-6 pt-0 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5"><label className="text-sm font-medium">Job Title</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.jobTitle || ""} onChange={(e) => setField("jobTitle" as any, e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Team</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.departmentId || ""} onChange={(e) => setField("departmentId" as any, e.target.value)}>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Role</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.roleId} onChange={(e) => setField("roleId", e.target.value)}>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Status</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.status} onChange={(e) => setField("status", e.target.value as Status)}><option value="active">Active</option><option value="inactive">Inactive</option><option value="blocked">Blocked</option></select></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6"><h3 className="text-lg font-semibold leading-none tracking-tight">Preview</h3></div>
            <div className="p-6 pt-0 flex flex-col items-center text-center">
              <div className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-semibold text-white ring-2 ring-background from-indigo-500 to-purple-500", `w-20 h-20 text-2xl`)}>
                <span>{form.name ? form.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "NU"}</span>
              </div>
              <p className="mt-3 font-semibold">{form.name || "New User"}</p>
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
