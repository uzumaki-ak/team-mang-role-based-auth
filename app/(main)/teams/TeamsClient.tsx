"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState, type FormEvent } from "react";

type TeamItem = {
  id: string;
  name: string;
  description?: string | null;
  code: string;
  _count: { members: number };
};

type SafeUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

const TeamsClient = () => {
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const deferredQuery = useDeferredValue(query);
  const isAdmin = currentUser?.role === "ADMIN";

  const loadCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (!response.ok) {
        setCurrentUser(null);
        return;
      }
      const data = (await response.json()) as SafeUser;
      setCurrentUser(data);
    } catch (err) {
      setCurrentUser(null);
    }
  };

  const loadTeams = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (deferredQuery) params.set("q", deferredQuery);
      const response = await fetch(`/api/team?${params.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Unable to load teams");
        setTeams([]);
        return;
      }
      const data = (await response.json()) as { teams: TeamItem[] };
      setTeams(data.teams);
    } catch (err) {
      setError("Unable to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    loadTeams();
  }, [deferredQuery]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin) return;
    setCreating(true);
    setError("");
    try {
      const response = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, code, description }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Unable to create team");
        return;
      }
      const data = (await response.json()) as { team: TeamItem };
      setTeams((prev) => [data.team, ...prev]);
      setName("");
      setCode("");
      setDescription("");
    } catch (err) {
      setError("Unable to create team");
    } finally {
      setCreating(false);
    }
  };

  if (!loading && !currentUser) {
    return (
      <div className="panel p-8">
        <div className="label">Authentication required</div>
        <h2 className="page-title mt-3">Sign in to view teams</h2>
        <p className="muted mt-3 text-sm">
          You need an account to manage teams and access codes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="label">Teams</div>
          <h2 className="page-title mt-3">Manage teams</h2>
          <p className="muted mt-2 text-sm">
            Keep groups organized and assign access codes.
          </p>
        </div>
      </div>

      <div className="panel p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="input"
            placeholder="Search teams or codes"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="chip">{teams.length} teams</div>
        </div>
        {error ? <div className="muted text-sm">{error}</div> : null}
      </div>

      {isAdmin ? (
        <form className="panel p-5 space-y-4" onSubmit={handleCreate}>
          <div className="label">Create team</div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Team name</label>
              <input
                className="input mt-2"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Team name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Access code</label>
              <input
                className="input mt-2"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Unique code"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <input
              className="input mt-2"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this team responsible for?"
            />
          </div>
          <button className="btn" type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create team"}
          </button>
        </form>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {loading ? (
          <div className="panel p-6">Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="panel p-6">No teams found.</div>
        ) : (
          teams.map((team) => (
            <div key={team.id} className="panel p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="label">{team.name}</div>
                  <h3 className="text-xl font-semibold mt-2">{team.name}</h3>
                </div>
                <span className="chip">{team._count.members} members</span>
              </div>
              <p className="muted mt-3 text-sm">
                {team.description || "No description set."}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="muted text-xs">Team code</div>
                  <div className="text-sm font-medium mt-1">{team.code}</div>
                </div>
                <Link 
                  href={`/users?teamId=${team.id}`}
                  className="btn btn-ghost"
                >
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamsClient;
