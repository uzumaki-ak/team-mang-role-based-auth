"use client";

import { useEffect, useState, type FormEvent } from "react";

type SafeUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  team?: { id: string; name: string } | null;
};

const ProfileClient = () => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const loadUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = (await response.json()) as SafeUser;
      setUser(data);
      setName(data.name || "");
      setEmail(data.email || "");
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(payload.error || "Unable to update profile");
        return;
      }

      setStatus("Profile updated");
      setPassword("");
      if (payload.user) {
        setUser(payload.user as SafeUser);
      }
    } catch (err) {
      setStatus("Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="panel p-8">
        <div className="label">Authentication required</div>
        <h2 className="page-title mt-3">Sign in to update profile</h2>
        <p className="muted mt-3 text-sm">
          Your account details are only available after you log in.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="label">Profile</div>
        <h2 className="page-title mt-3">Account details</h2>
        <p className="muted mt-2 text-sm">
          Update your personal information and access preferences.
        </p>
      </div>

      <form className="panel p-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input
            className="input mt-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            className="input mt-2"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Role</label>
          <input className="input mt-2" value={user.role} disabled />
        </div>
        <div>
          <label className="text-sm font-medium">Team</label>
          <input
            className="input mt-2"
            value={user.team?.name || "Unassigned"}
            disabled
          />
        </div>
        <div>
          <label className="text-sm font-medium">New password</label>
          <input
            className="input mt-2"
            type="password"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {status ? <div className="muted text-sm">{status}</div> : null}
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileClient;
