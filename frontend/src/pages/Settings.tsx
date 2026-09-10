import * as React from "react";
import {
  Save,
  Sun,
  Moon,
  Monitor,
  Bell,
  Lock,
  User,
  Shield,
  Key,
  ShieldCheck,
  Sparkles,
  Zap,
  Star,
  Palette,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  Switch,
  Tabs,
  Textarea,
} from "@/components/ui";
import { useTheme, useStore, isSuperAdmin } from "@/store";
import type { ThemeMode } from "@/store";
import { useToastError } from "@/core/api/toastUtils";
import { useUsersStore } from "@/modules/users";
import { SharedButton, SharedBadge } from "@/shared/components";

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toastError, toastSuccess } = useToastError();
  const {
    currentRoleId,
    currentUser,
    roles,
    superAdminPassword,
    setSuperAdminPassword,

    addLog,
  } = useStore();
  const { users } = useUsersStore();


  const superAdmin = isSuperAdmin(currentRoleId);
  const isAdmin = currentRoleId === "r2";
  const currentRole = roles.find((r) => r.id === currentRoleId);

  const allTabs = [
    { value: "account", label: "Account", icon: <User size={14} />, show: true },
    { value: "appearance", label: "Appearance", icon: <Palette size={14} />, show: true },
    { value: "notifications", label: "Notifications", icon: <Bell size={14} />, show: true },
    { value: "security", label: "Security", icon: <Lock size={14} />, show: true },
  ];
  const tabs = allTabs.filter((t) => t.show);
  const [tab, setTab] = React.useState<string>(tabs[0]?.value || "account");

  React.useEffect(() => {
    if (!tabs.find((t) => t.value === tab)) setTab(tabs[0]?.value || "account");
  }, [currentRoleId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [prefs, setPrefs] = React.useState({
    notifEmail: true,
    notifPush: false,
    notifWeekly: true,
    notifMentions: true,
    notifSecurity: true,
    twoFactor: false,
    sessions: true,
    sso: false,
    ipAllowlist: false,
    auditRetention: true,
  });



  const [pwForm, setPwForm] = React.useState({
    current: "",
    next: "",
    confirm: "",
    show: false,
  });

  // Reset Password Form State (inline, using existing Input components)
  const [resetPwForm, setResetPwForm] = React.useState({
    newPassword: "",
    confirmPassword: "",
    show: false,
    errors: {} as Record<string, string>,
  });
  const [resetLoading, setResetLoading] = React.useState(false);

  const validateResetForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!resetPwForm.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (resetPwForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(resetPwForm.newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(resetPwForm.newPassword)) {
      newErrors.newPassword = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(resetPwForm.newPassword)) {
      newErrors.newPassword = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(resetPwForm.newPassword)) {
      newErrors.newPassword = "Password must contain at least one special character";
    }

    if (!resetPwForm.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (resetPwForm.newPassword !== resetPwForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setResetPwForm(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!currentUser || !validateResetForm()) return;

    setResetLoading(true);
    try {
      const res = await useUsersStore.getState().resetUserPassword(currentUser.id, resetPwForm.newPassword, resetPwForm.confirmPassword);
      toastSuccess(res);
      setResetPwForm({ newPassword: "", confirmPassword: "", show: false, errors: {} });
    } catch (error) {
      toastError(error, { title: "Reset failed" });
    } finally {
      setResetLoading(false);
    }
  };

  const save = (msg = "Settings saved") => toastSuccess({ success: true, message: msg });

  const changePassword = () => {
    if (!superAdmin) {
      toastError({ message: "Only the Super Admin can change passwords. Contact them for assistance." }, { title: "Not allowed" });
      return;
    }
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      toastError({ message: "All fields are required" }, { title: "Error" });
      return;
    }
    if (pwForm.current !== superAdminPassword) {
      toastError({ message: "Current password is incorrect" }, { title: "Error" });
      return;
    }
    if (pwForm.next.length < 8) {
      toastError({ message: "At least 8 characters." }, { title: "Password too short" });
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toastError({ message: "Passwords do not match" }, { title: "Error" });
      return;
    }
    setSuperAdminPassword(pwForm.next);
    addLog({ userId: users[0]?.id || "u", action: "Changed super-admin password", target: "Account", type: "update" });
    toastSuccess({ success: true, message: "Your Super Admin password has been changed." });
    setPwForm({ current: "", next: "", confirm: "", show: false });
  };



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, preferences and system-wide configuration.
        </p>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={tabs} />

      {/* ===================== ACCOUNT ===================== */}
      {tab === "account" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your basic account info. Name changes are locked and must be requested from the Super Admin.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar name={currentUser.name} size={72} />
                <div>
                  <Button variant="outline" size="sm">Change avatar</Button>
                  <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Full Name (locked)</Label>
                  <div className="relative">
                    <Input value={currentUser.name} disabled />
                    <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Contact the Super Admin to change your name.</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Email (locked)</Label>
                  <div className="relative">
                    <Input value={currentUser.email} disabled />
                    <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Job Title</Label>
                  <Input defaultValue={superAdmin ? "Head of Product" : "Team Member"} />
                </div>
                <div className="space-y-1.5">
                  <Label>Preferred Timezone</Label>
                  <Select
                    value="pst"
                    onChange={() => {}}
                    options={[
                      { label: "Pacific (PST)", value: "pst" },
                      { label: "Eastern (EST)", value: "est" },
                      { label: "GMT", value: "gmt" },
                      { label: "CET", value: "cet" },
                    ]}
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea defaultValue="Building great products with a distributed team." />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => save("Profile updated")}><Save size={14} /> Save changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signed in as</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={currentUser.name} size={44} />
                  <div>
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="default">
                    <Shield size={10} className="mr-1" />
                    {currentRole?.name}
                  </Badge>
                  {(currentRoleId === "r3" || currentRoleId === "r4") && (
                    <Badge variant="warning">Limited access</Badge>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {superAdmin && "You have full unrestricted access to all system settings."}
                {isAdmin && "You can manage users, roles, and integrations."}
                {currentRoleId === "r3" && "You can view users and access basic settings. Roles and system settings are hidden."}
                {currentRoleId === "r4" && "You have read-only access to Dashboard and Users."}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== APPEARANCE ===================== */}
      {tab === "appearance" && (
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <p className="text-sm text-muted-foreground">Customize how Nexus looks on this device.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(
                [
                  { mode: "minimal-light", label: "Minimal Light", icon: <Sun size={20} /> },
                  { mode: "dark", label: "Dark Mode", icon: <Moon size={20} /> },
                  { mode: "retro", label: "Retro Split-Flap", icon: <Sparkles size={20} /> },
                  { mode: "neon", label: "Neon Glow", icon: <Zap size={20} /> },
                  { mode: "monochrome", label: "Monochrome", icon: <Monitor size={20} /> },
                  { mode: "glass", label: "Frosted Glass", icon: <Palette size={20} /> },
                  { mode: "terminal", label: "Terminal", icon: <Shield size={20} /> },
                  { mode: "luxury", label: "Luxury Gold", icon: <Star size={20} /> },
                ] as { mode: ThemeMode; label: string; icon: React.ReactNode }[]
              ).map((t) => {
                const active = theme === t.mode;
                return (
                  <button
                    key={t.mode}
                    onClick={() => {
                      if (theme !== t.mode) setTheme(t.mode);
                    }}
                    className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all ${
                      active ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {t.icon}
                    </div>
                    <span className="font-medium">{t.label}</span>
                    {active && <Check size={14} className="text-primary" />}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===================== NOTIFICATIONS ===================== */}
      {tab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <p className="text-sm text-muted-foreground">Choose which notifications you want to receive.</p>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {[
              { key: "notifEmail", label: "Email notifications", desc: "Receive important updates via email." },
              { key: "notifPush", label: "Push notifications", desc: "Browser push alerts for critical events." },
              { key: "notifWeekly", label: "Weekly digest", desc: "A summary of your team's activity each Monday." },
              { key: "notifMentions", label: "Mentions & replies", desc: "When someone tags you or replies to a comment." },
              { key: "notifSecurity", label: "Security alerts", desc: "New sign-ins and password changes." },
            ].map((row) => (
              <div key={row.key} className="flex items-center justify-between py-4">
                <div className="pr-4">
                  <p className="text-sm font-medium">{row.label}</p>
                  <p className="text-xs text-muted-foreground">{row.desc}</p>
                </div>
                <Switch
                  checked={prefs[row.key as keyof typeof prefs] as boolean}
                  onCheckedChange={(v) => setPrefs({ ...prefs, [row.key]: v })}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ===================== SECURITY ===================== */}
      {tab === "security" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Password change – ONLY super admin */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key size={16} /> Password
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {superAdmin
                  ? "Update your Super Admin password."
                  : "Password changes are restricted. Only the Super Admin can update passwords in this workspace."}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {!superAdmin && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
                  <Lock size={14} className="mt-0.5 text-amber-500" />
                  <div>
                    <p className="font-medium">Password changes are disabled</p>
                    <p className="mt-0.5 text-muted-foreground">
                      For security, only the Super Admin can change or reset passwords. Please reach out to them to request a password reset.
                    </p>
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Current password</Label>
                <div className="relative">
                  <Input
                    type={pwForm.show ? "text" : "password"}
                    placeholder="••••••••"
                    value={pwForm.current}
                    onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                    disabled={!superAdmin}
                  />
                  <button
                    type="button"
                    onClick={() => setPwForm({ ...pwForm, show: !pwForm.show })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={!superAdmin}
                  >
                    {pwForm.show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {superAdmin && (
                  <p className="text-[10px] text-muted-foreground">
                    Demo password: <code className="rounded bg-muted px-1">{superAdminPassword}</code>
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>New password</Label>
                <Input
                  type={pwForm.show ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={pwForm.next}
                  onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                  disabled={!superAdmin}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm new password</Label>
                <Input
                  type={pwForm.show ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  disabled={!superAdmin}
                />
              </div>
              <Button onClick={changePassword} disabled={!superAdmin}>
                Update password
              </Button>
            </CardContent>
          </Card>

          {/* Security & Privacy - Available to all users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={16} /> Security & Privacy
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your security settings and privacy preferences.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Enabled via Authenticator</p>
                    </div>
                  </div>
                  <SharedBadge variant="success">Active</SharedBadge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Last Login</p>
                      <p className="text-xs text-muted-foreground">{currentUser.lastActive ? new Date(currentUser.lastActive).toLocaleString() : "—"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key size={18} className="text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Reset Password</p>
                      <p className="text-xs text-muted-foreground">Generate a new password for your account</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset Password Form - Inline */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-3">Reset Your Password</h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>New Password *</Label>
                    <div className="relative">
                      <Input
                        type={resetPwForm.show ? "text" : "password"}
                        placeholder="Enter new password"
                        value={resetPwForm.newPassword}
                        onChange={(e) => setResetPwForm({ ...resetPwForm, newPassword: e.target.value })}
                        disabled={resetLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setResetPwForm(prev => ({ ...prev, show: !prev.show }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={resetLoading}
                      >
                        {resetPwForm.show ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {resetPwForm.errors.newPassword && <p className="text-xs text-destructive">{resetPwForm.errors.newPassword}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Confirm Password *</Label>
                    <Input
                      type={resetPwForm.show ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={resetPwForm.confirmPassword}
                      onChange={(e) => setResetPwForm({ ...resetPwForm, confirmPassword: e.target.value })}
                      disabled={resetLoading}
                    />
                    {resetPwForm.errors.confirmPassword && <p className="text-xs text-destructive">{resetPwForm.errors.confirmPassword}</p>}
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
                  <Button onClick={handleResetPassword} disabled={resetLoading}>
                    {resetLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

    </div>
  );
};
