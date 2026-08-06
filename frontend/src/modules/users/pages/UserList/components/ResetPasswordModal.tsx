import React from "react";
import { SharedModal } from "@/shared/components";
import { SharedButton, SharedInput } from "@/shared/components";
import { useToast } from "@/components/ui/toast";
import { UserService } from "@/modules/users/services";
import type { User } from "@/lib/types";

interface ResetPasswordModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  user,
  onClose,
}) => {
  const { toast } = useToast();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!user || !validateForm()) return;

    setLoading(true);
    try {
      await UserService.resetUserPassword(user.id, password);
      toast({ type: "success", title: "Password reset successfully" });
      onClose();
    } catch (error: any) {
      toast({ type: "error", title: "Reset failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  if (!open || !user) return null;

  return (
    <SharedModal
      open={open}
      onClose={handleClose}
      title={`Reset Password for ${user.firstName} ${user.lastName}`}
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter a new password for <strong>{user.firstName} {user.lastName}</strong> ({user.email}).
          The user will need to use this new password to log in.
        </p>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">New Password *</label>
          <SharedInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            error={errors.password}
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Confirm Password *</label>
          <SharedInput
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            error={errors.confirmPassword}
            disabled={loading}
          />
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Password requirements:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>At least 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <SharedButton variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </SharedButton>
          <SharedButton onClick={handleSubmit} loading={loading}>
            Reset Password
          </SharedButton>
        </div>
      </div>
    </SharedModal>
  );
};