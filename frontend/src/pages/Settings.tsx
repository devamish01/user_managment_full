import * as React from "react";
import {
  Save,
  Sun,
  Moon,
  Monitor,
  Bell,
  Lock,
  Globe,
  User,
  Shield,
  Key,
  AlertTriangle,
  Building,
  Palette,
  Plug,
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
import { useTheme, useStore, useHasPermission, isSuperAdmin } from "@/store";
import { useToast } from "@/components/ui/toast";
import { useUsersStore } from "@/modules/users";

export const Settings = () => {
  const { theme, toggle } = useTheme();
  const { toast } = useToast();
  const {
    currentRoleId,
    currentUser,
    roles,
    superAdminPassword,
    setSuperAdminPassword,

    addLog,
  } = useStore();
  const { users } = useUsersStore();

  const hasPermission = useHasPermission();

  const superAdmin = isSuperAdmin(currentRoleId);
  const isAdmin = currentRoleId === "r2";
  const currentRole = roles.find((r) => r.id === currentRoleId);

  const allTabs = [
    { value: "account", label: "Account", icon: <User size={14} />, show: true },
    { value: "appearance", label: "Appearance", icon: <Palette size={14} />, show: true },
    { value: "notifications", label: "Notifications", icon: <Bell size={14} />, show: true },
    { value: "security", label: "Security", icon: <Lock size={14} />, show: true },
    { value: "workspace", label: "Workspace", icon: <Building size={14} />, show: hasPermission("settings.workspace") },
    { value: "integrations", label: "Integrations", icon: <Plug size={14} />, show: hasPermission("settings.integrations") },
    { value: "danger", label: "Danger Zone", icon: <AlertTriangle size={14} />, show: hasPermission("settings.danger") },
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

  const [workspace, setWorkspace] = React.useState({
    name: "Nexus HQ",
    url: "nexus.company.io",
    language: "en",
    timezone: "pst",
    dateFormat: "mdy",
    weekStart: "sun",
    branding: "auto",
  });

  const [pwForm, setPwForm] = React.useState({
    current: "",
    next: "",
    confirm: "",
    show: false,
  });

  const [resetTargetId, setResetTargetId] = React.useState<string>("");
  const [resetPw, setResetPw] = React.useState("");

  const save = (msg = "Settings saved") => toast({ type: "success", title: msg });

  const changePassword = () => {
    if (!superAdmin) {
      toast({
        type: "error",
        title: "Not allowed",
        description: "Only the Super Admin can change passwords. Contact them for assistance.",
      });
      return;
    }
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      toast({ type: "error", title: "All fields are required" });
      return;
    }
    if (pwForm.current !== superAdminPassword) {
      toast({ type: "error", title: "Current password is incorrect" });
      return;
    }
    if (pwForm.next.length < 8) {
      toast({ type: "error", title: "Password too short", description: "At least 8 characters." });
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toast({ type: "error", title: "Passwords do not match" });
      return;
    }
    setSuperAdminPassword(pwForm.next);
    addLog({ userId: users[0]?.id || "u", action: "Changed super-admin password", target: "Account", type: "update" });
    toast({ type: "success", title: "Password updated", description: "Your Super Admin password has been changed." });
    setPwForm({ current: "", next: "", confirm: "", show: false });
  };

  const resetUserPassword = () => {
    if (!resetTargetId) {
      toast({ type: "error", title: "Select a user first" });
      return;
    }
    if (resetPw.length < 8) {
      toast({ type: "error", title: "Password too short", description: "At least 8 characters." });
      return;
    }
    const target = users.find((u) => u.id === resetTargetId);
    addLog({ userId: users[0]?.id || "u", action: "Reset password", target: target?.name || "user", type: "update" });
    toast({ type: "success", title: "Password reset", description: `New password set for ${target?.name}.` });
    setResetPw("");
    setResetTargetId("");
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { value: "light", label: "Light", icon: <Sun size={20} /> },
                { value: "dark", label: "Dark", icon: <Moon size={20} /> },
                { value: "system", label: "System", icon: <Monitor size={20} /> },
              ].map((t) => {
                const active = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => {
                      if (t.value !== theme && t.value !== "system") toggle();
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

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor & Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "twoFactor", label: "Two-factor authentication", desc: "Add an extra layer of security." },
                { key: "sessions", label: "New sign-in alerts", desc: "Get notified about new devices signing in." },
                { key: "sso", label: "Single Sign-On (SSO)", desc: "Allow SAML/OIDC based login." },
                { key: "ipAllowlist", label: "IP allowlist", desc: "Restrict access to specific IPs." },
              ].map((row) => (
                <div key={row.key} className="flex items-center justify-between rounded-lg border border-border p-3">
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
              <Button variant="outline" className="w-full" onClick={() => save("Sessions signed out")}>
                Sign out of all other sessions
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== WORKSPACE ===================== */}
      {tab === "workspace" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <p className="text-sm text-muted-foreground">Configure basic workspace information.</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Workspace name</Label>
                <Input value={workspace.name} onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Workspace URL</Label>
                <div className="relative">
                  <Input value={workspace.url} onChange={(e) => setWorkspace({ ...workspace, url: e.target.value })} className="pr-16" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">.io</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Default language</Label>
                <Select
                  value={workspace.language}
                  onChange={(v) => setWorkspace({ ...workspace, language: v })}
                  options={[
                    { label: "English", value: "en" },
                    { label: "Español", value: "es" },
                    { label: "Français", value: "fr" },
                    { label: "Deutsch", value: "de" },
                    { label: "日本語", value: "ja" },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select
                  value={workspace.timezone}
                  onChange={(v) => setWorkspace({ ...workspace, timezone: v })}
                  options={[
                    { label: "Pacific (PST)", value: "pst" },
                    { label: "Eastern (EST)", value: "est" },
                    { label: "GMT", value: "gmt" },
                    { label: "CET", value: "cet" },
                    { label: "IST", value: "ist" },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Date format</Label>
                <Select
                  value={workspace.dateFormat}
                  onChange={(v) => setWorkspace({ ...workspace, dateFormat: v })}
                  options={[
                    { label: "MM/DD/YYYY", value: "mdy" },
                    { label: "DD/MM/YYYY", value: "dmy" },
                    { label: "YYYY-MM-DD", value: "ymd" },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Week starts on</Label>
                <Select
                  value={workspace.weekStart}
                  onChange={(v) => setWorkspace({ ...workspace, weekStart: v })}
                  options={[
                    { label: "Sunday", value: "sun" },
                    { label: "Monday", value: "mon" },
                    { label: "Saturday", value: "sat" },
                  ]}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={() => save("Workspace saved")}><Save size={14} /> Save workspace</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <p className="text-sm text-muted-foreground">Personalize how your workspace looks for members.</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { value: "auto", label: "System default", desc: "Match user preference" },
                { value: "light", label: "Force light", desc: "Always light for members" },
                { value: "dark", label: "Force dark", desc: "Always dark for members" },
              ].map((b) => (
                <button
                  key={b.value}
                  onClick={() => setWorkspace({ ...workspace, branding: b.value })}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    workspace.branding === b.value ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{b.label}</p>
                    {workspace.branding === b.value && <Check size={14} className="text-primary" />}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit & Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Retain audit logs</p>
                  <p className="text-xs text-muted-foreground">Keep activity logs for 90 days</p>
                </div>
                <Switch
                  checked={prefs.auditRetention}
                  onCheckedChange={(v) => setPrefs({ ...prefs, auditRetention: v })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Super admin password reset for members */}
          {superAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key size={16} /> Reset user password
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Only the Super Admin can reset a member's password. Members cannot change it themselves.
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1.5 md:col-span-2">
                  <Label>User</Label>
                  <Select
                    value={resetTargetId}
                    onChange={setResetTargetId}
                    placeholder="Select a user"
                    options={users.slice(0, 30).map((u) => ({ label: `${u.name} — ${u.email}`, value: u.id }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>New password</Label>
                  <Input
                    type="password"
                    placeholder="At least 8 chars"
                    value={resetPw}
                    onChange={(e) => setResetPw(e.target.value)}
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button onClick={resetUserPassword}>Reset password</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ===================== INTEGRATIONS ===================== */}
      {tab === "integrations" && (
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <p className="text-sm text-muted-foreground">Connect Nexus with the tools your team already uses.</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Slack", desc: "Get notifications in your channels", connected: true, color: "from-purple-500 to-fuchsia-500" },
              { name: "Google Workspace", desc: "Sync users and calendars", connected: true, color: "from-blue-500 to-cyan-500" },
              { name: "GitHub", desc: "Link repositories and PRs", connected: false, color: "from-slate-500 to-zinc-700" },
              { name: "Jira", desc: "Track issues and sprints", connected: false, color: "from-blue-600 to-indigo-600" },
              { name: "Zoom", desc: "Schedule and join meetings", connected: true, color: "from-sky-500 to-blue-500" },
              { name: "Stripe", desc: "Manage subscriptions", connected: false, color: "from-indigo-500 to-purple-500" },
            ].map((i) => (
              <div key={i.name} className="rounded-lg border border-border p-4 transition-all hover:shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${i.color} text-white`}>
                    <Plug size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{i.name}</p>
                      {i.connected && <Badge variant="success">Connected</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{i.desc}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  {i.connected ? "Configure" : "Connect"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ===================== DANGER ZONE (Super Admin only) ===================== */}
      {tab === "danger" && superAdmin && (
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle size={18} /> Danger Zone
            </CardTitle>
            <p className="text-sm text-muted-foreground">Irreversible actions — proceed with caution.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Transfer ownership", desc: "Transfer this workspace to another Super Admin.", cta: "Transfer" },
              { label: "Reset all sessions", desc: "Force sign-out for every member in the workspace.", cta: "Reset" },
              { label: "Delete workspace", desc: "Permanently delete this workspace and all its data.", cta: "Delete", destructive: true },
            ].map((row) => (
              <div key={row.label} className="flex flex-col justify-between gap-3 rounded-lg border border-border p-4 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-semibold">{row.label}</p>
                  <p className="text-xs text-muted-foreground">{row.desc}</p>
                </div>
                <Button
                  variant={row.destructive ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => toast({ type: "warning", title: `${row.cta} triggered (demo)` })}
                >
                  {row.cta}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Restricted note for lower roles hitting workspace/integrations/danger */}
      {(currentRoleId === "r3" || currentRoleId === "r4") && (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3 text-xs">
          <Globe size={14} className="mt-0.5 text-muted-foreground" />
          <div>
            <p className="font-medium">Some tabs are hidden</p>
            <p className="mt-0.5 text-muted-foreground">
              Workspace, Integrations, and Danger Zone are only visible to Admins and Super Admins.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
