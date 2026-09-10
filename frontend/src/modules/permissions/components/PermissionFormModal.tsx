import * as React from "react";
import {
  Label,
  Textarea,
  Select,
} from "@/components/ui";
import { SharedButton, SharedInput, SharedModal } from "@/shared/components";
import type { Permission } from "@/lib/types";

interface PermissionFormModalProps {
  open: boolean;
  creating: boolean;
  editing: Partial<Permission> | null;
  baseModules: string[];
  onClose: () => void;
  onChange: (next: Partial<Permission> | null) => void;
  onSave: () => void;
}

export const PermissionFormModal = ({ open, creating, editing, baseModules, onClose, onChange, onSave }: PermissionFormModalProps) => {
  return (
    <SharedModal open={!!editing} onClose={onClose} size="md" title={creating ? "Create Permission" : "Edit Permission"}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Name</Label><SharedInput value={editing?.name} onChange={e => onChange({ ...editing!, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Module</Label><Select value={editing?.module || ""} onChange={(v: string) => onChange({ ...editing!, module: v })} options={[...baseModules.map(m => ({ label: m, value: m })), ...baseModules.map(m => ({ label: `${m} UI`, value: `${m} UI` }))]} /></div>
          <div className="space-y-1.5 col-span-2"><Label>Key</Label><SharedInput value={editing?.key} onChange={e => onChange({ ...editing!, key: e.target.value })} disabled={!creating} className={!creating ? "bg-muted" : ""} placeholder={creating ? "e.g. users.create, permissions.view" : "Key cannot be edited after creation"} /><p className="text-xs text-muted-foreground">Lowercase letters and dots only (e.g. users.create)</p></div>
          <div className="space-y-1.5 col-span-2"><Label>Description</Label><Textarea value={editing?.description} onChange={e => onChange({ ...editing!, description: e.target.value })} /></div>
        </div>
        <div className="flex justify-end gap-2"><SharedButton variant="outline" onClick={onClose}>Cancel</SharedButton><SharedButton onClick={onSave}>{creating ? "Create" : "Save"}</SharedButton></div>
      </div>
    </SharedModal>
  );
};
