import React from "react";
import { Save, X } from "lucide-react";
import { SharedButton, SharedModal } from "@/shared/components";
import type { UserFormState } from "@/modules/users/types";
import type { Role, Status, User } from "@/lib/types";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  editingUser: User | null;
  form: UserFormState;
  setField: <K extends keyof UserFormState>(key: K, value: UserFormState[K]) => void;
  roles: Role[];
  onSave: () => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  editingUser,
  form,
  setField,
  roles,
  onSave,
}) => (
  <SharedModal open={open} onClose={onClose} size="lg" title={editingUser ? "Edit User" : "Add New User"}>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">First Name *</label>
        <input
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={form.firstName}
          onChange={(e) => setField("firstName", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Last Name *</label>
        <input
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={form.lastName}
          onChange={(e) => setField("lastName", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Email *</label>
        <input
          type="email"
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
        />
      </div>
      {!editingUser && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Username (optional)</label>
          <input
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
            value={form.username || ""}
            onChange={(e) => setField("username", e.target.value)}
            placeholder="Auto-generated from name if empty"
          />
        </div>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Mobile</label>
        <input
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={form.phone}
          onChange={(e) => setField("phone", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Role</label>
        <select
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={form.roleId}
          onChange={(e) => setField("roleId", e.target.value)}
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Status</label>
        <select
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={form.status}
          onChange={(e) => setField("status", e.target.value as Status)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blocked">Blocked</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Location</label>
        <input
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={form.location || ""}
          onChange={(e) => setField("location", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Job Title</label>
        <input
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={form.jobTitle || ""}
          onChange={(e) => setField("jobTitle", e.target.value)}
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <label className="text-sm font-medium">Address</label>
        <input
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={form.address || ""}
          onChange={(e) => setField("address", e.target.value)}
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <label className="text-sm font-medium">Bio</label>
        <textarea
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          value={form.bio || ""}
          onChange={(e) => setField("bio", e.target.value)}
        />
      </div>
      {!editingUser && (
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium">Password *</label>
          <input
            type="password"
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
            value={form.password || ""}
            onChange={(e) => setField("password", e.target.value)}
          />
        </div>
      )}
    </div>
    <div className="flex justify-end gap-2 mt-6">
      <SharedButton variant="outline" onClick={onClose}>
        <X size={14} /> Cancel
      </SharedButton>
      <SharedButton onClick={onSave}>
        <Save size={14} /> {editingUser ? "Save Changes" : "Create User"}
      </SharedButton>
    </div>
  </SharedModal>
);