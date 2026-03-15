"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Role } from "@/app/types";

type TeamOption = {
  id: string;
  name: string;
};

type UserItem = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  team?: { id: string; name: string } | null;
  teamId?: string | null;
};

type SafeUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  teamId?: string | null;
  team?: { id: string; name: string } | null;
};

const UsersClient = () => {
  const searchParams = useSearchParams();
  const urlRole = searchParams.get("role") || "";
  const urlTeamId = searchParams.get("teamId") || "";

  const [users, setUsers] = useState<UserItem[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState(urlRole);
  const [teamFilterId, setTeamFilterId] = useState(urlTeamId);
  
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("USER");
  const [formTeamId, setFormTeamId] = useState("");
  const [formPassword, setFormPassword] = useState("");
  
  const [inviteInfo, setInviteInfo] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    message: string;
    detail?: string;
  } | null>(null);

  const deferredQuery = useDeferredValue(query);
  const isAdmin = currentUser?.role === Role.ADMIN;

  const loadCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      }
    } catch (err) {
      // Silent fail
    }
  };

  const loadTeams = async () => {
    try {
      const response = await fetch("/api/team", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams);
      }
    } catch (err) {
      // Silent fail
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set("role", roleFilter);
      if (teamFilterId) params.set("teamId", teamFilterId);
      if (deferredQuery) params.set("q", deferredQuery);
      
      const response = await fetch(`/api/user?${params.toString()}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (err) {
      setError("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
    loadTeams();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [roleFilter, teamFilterId, deferredQuery]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleRoleChange = async (userId: string, nextRole: string) => {
    if (!isAdmin || userId === currentUser?.id) return;
    try {
      const response = await fetch(`/api/user/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: nextRole }),
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u));
        setToast({ kind: "success", message: "Role updated" });
      }
    } catch (err) {
      setToast({ kind: "error", message: "Failed to update role" });
    }
  };

  const handleTeamChange = async (userId: string, nextTeamId: string) => {
    if (!isAdmin) return;
    try {
      const response = await fetch(`/api/user/${userId}/team`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teamId: nextTeamId || null }),
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u));
        setToast({ kind: "success", message: "Team updated" });
      }
    } catch (err) {
      setToast({ kind: "error", message: "Failed to update team" });
    }
  };
  const handleDelete = async (userId: string) => {
    if (!isAdmin || userId === currentUser?.id) return;
    if (!window.confirm("Are you sure you want to remove this user identity? This action is permanent.")) return;

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setToast({ kind: "success", message: "Identity purged" });
      } else {
        const data = await response.json();
        setToast({ kind: "error", message: data.error || "Purge failed" });
      }
    } catch (err) {
      setToast({ kind: "error", message: "Network error during purge" });
    }
  };

  const handleCreate = async (mode: "create" | "invite") => {
    if (!isAdmin) return;
    if (!formEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
      setToast({ kind: "error", message: "Enter a valid email" });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/user/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim(),
          role: formRole,
          teamId: formTeamId || null,
          password: mode === "create" ? formPassword.trim() : undefined,
          mode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormName("");
        setFormEmail("");
        setFormPassword("");
        setToast({
          kind: "success",
          message: mode === "invite" ? "Invite created" : "User created",
          detail: data.temporaryPassword ? `Temp Pwd: ${data.temporaryPassword}` : undefined
        });
        loadUsers();
      } else {
        const data = await response.json();
        setToast({ kind: "error", message: data.error || "Operation failed" });
      }
    } catch (err) {
      setToast({ kind: "error", message: "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <div className="label text-(--muted)">DIRECTORY</div>
        <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-barlow)' }}>
          {isAdmin ? "User Management" : "Teammates"}
        </h1>
        <p className="text-(--muted) text-sm max-w-2xl">
          {isAdmin 
            ? "Full access to the global identity directory. Manage roles and team assignments across the organization."
            : `Viewing active members of your workspace synchronization.`}
        </p>
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`panel p-4 min-w-[300px] border-l-4 ${toast.kind === 'success' ? 'border-green-500' : 'border-red-500'} shadow-2xl`}>
            <div className="text-sm font-bold uppercase tracking-widest mb-1">{toast.kind}</div>
            <div className="text-sm font-medium">{toast.message}</div>
            {toast.detail && <div className="text-[10px] text-(--muted) mt-2 font-mono bg-(--surface-2) p-1 rounded">{toast.detail}</div>}
          </div>
        </div>
      )}

      {isAdmin && (
        <section className="panel p-8 space-y-8">
          <div className="label text-(--muted)">DIRECTORY CONTROLS</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider">Full Name</label>
              <input className="input" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Shreya" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider">Email Address</label>
              <input className="input" type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="user@domain.com" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider">Default Role</label>
              <select className="input" value={formRole} onChange={e => setFormRole(e.target.value)}>
                <option value="USER">User</option>
                <option value="MANAGER">Manager</option>
                <option value="GUEST">Guest</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider">Team Assignment</label>
              <select className="input" value={formTeamId} onChange={e => setFormTeamId(e.target.value)}>
                <option value="">Unassigned</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-(--border)">
            <button className="btn px-8" onClick={() => handleCreate("create")} disabled={submitting}>
              {submitting ? "Processing..." : "Create User"}
            </button>
            <button className="btn btn-ghost px-8" onClick={() => handleCreate("invite")} disabled={submitting}>
              Invite via Auth
            </button>
          </div>
        </section>
      )}

      <section className="panel overflow-hidden">
        <div className="p-6 border-b border-(--border) flex flex-wrap items-center justify-between gap-4 bg-(--surface-2)/30">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <input 
              className="input bg-transparent border-none focus:ring-0 text-lg px-0" 
              placeholder="Search directory..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <select className="input w-32 text-xs" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="input w-40 text-xs" value={teamFilterId} onChange={e => setTeamFilterId(e.target.value)}>
              <option value="">All Teams</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-(--border) bg-(--surface-2)/10">
                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-(--muted)" style={{ fontFamily: 'var(--font-barlow)' }}>User</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-(--muted)" style={{ fontFamily: 'var(--font-barlow)' }}>Role</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-(--muted)" style={{ fontFamily: 'var(--font-barlow)' }}>Team</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-(--muted)" style={{ fontFamily: 'var(--font-barlow)' }}>Status</th>
                {isAdmin && <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-(--muted)" style={{ fontFamily: 'var(--font-barlow)' }}>Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-(--muted) animate-pulse uppercase tracking-widest text-xs font-bold">Loading records...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-(--muted) uppercase tracking-widest text-xs font-bold">No records found</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-(--surface-2)/20 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-(--surface-2) border border-(--border) flex items-center justify-center text-xs font-bold">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{user.name || "Anonymous"}</div>
                          <div className="text-xs text-(--muted)">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      {isAdmin && user.id !== currentUser?.id ? (
                        <select 
                          className="input text-xs py-1 h-auto w-auto bg-transparent hover:bg-(--surface-2) border-dashed"
                          value={user.role}
                          onChange={e => handleRoleChange(user.id, e.target.value)}
                        >
                          {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-wider">{user.role}</span>
                      )}
                    </td>
                    <td className="p-6">
                       {isAdmin ? (
                        <select 
                          className="input text-xs py-1 h-auto w-auto bg-transparent hover:bg-(--surface-2) border-dashed"
                          value={user.team?.id || ""}
                          onChange={e => handleTeamChange(user.id, e.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs">{user.team?.name || "—"}</span>
                      )}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="p-6">
                        {user.id !== currentUser?.id ? (
                          <button 
                            className="text-(--muted) hover:text-red-500 transition-colors"
                            onClick={() => handleDelete(user.id)}
                            title="Purge Identity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-(--muted) opacity-30">Self</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-(--border) bg-(--surface-2)/10 flex justify-between items-center px-6">
          <div className="text-[10px] uppercase font-bold text-(--muted)">
            Showing {users.length} Records
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost py-1 px-3 text-[10px] opacity-50 cursor-not-allowed">PREV</button>
            <button className="btn btn-ghost py-1 px-3 text-[10px] opacity-50 cursor-not-allowed">NEXT</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UsersClient;
