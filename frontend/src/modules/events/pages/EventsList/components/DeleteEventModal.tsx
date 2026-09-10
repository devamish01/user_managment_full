import { AlertTriangle, Trash2 } from "lucide-react";
import { SharedModal } from "@/shared/components/SharedModal";
import { SharedButton } from "@/shared/components/SharedButton";

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
  eventName?: string;
  isBulk?: boolean;
  count?: number;
}

export function DeleteEventModal({ isOpen, onClose, onConfirm, loading, eventName, isBulk, count }: DeleteEventModalProps) {
  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={isBulk ? `Delete ${count} Events` : "Delete Event"}
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-sm text-gray-600">
            {isBulk 
              ? `Are you sure you want to delete ${count} events? This action cannot be undone.`
              : `Are you sure you want to delete "${eventName}"? This action cannot be undone.`}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <SharedButton variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </SharedButton>
          <SharedButton variant="destructive" onClick={onConfirm} loading={loading} icon={<Trash2 className="w-4 h-4" />}>
            {isBulk ? `Delete ${count} Events` : "Delete Event"}
          </SharedButton>
        </div>
      </div>
    </SharedModal>
  );
}