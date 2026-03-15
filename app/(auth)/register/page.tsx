"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const nextPath = nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, teamCode }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Registration failed. Verify your details.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError("A connection error occurred. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center max-w-sm mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="label text-(--muted) tracking-[0.3em]" style={{ fontFamily: 'var(--font-orbitron)' }}>MEMBERSHIP</div>
        <h1 className="text-4xl font-bold tracking-tighter uppercase" style={{ fontFamily: 'var(--font-barlow)' }}>
          Create Identity
        </h1>
        <p className="text-sm text-(--muted)">
          Establish your presence in the workspace.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-(--muted) ml-1">Full Name</label>
          <input
            className="input bg-(--surface-2)/50 border-(--border) focus:border-(--text) transition-all"
            placeholder="e.g. Shreya"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-(--muted) ml-1">Email Address</label>
          <input
            className="input bg-(--surface-2)/50 border-(--border) focus:border-(--text) transition-all"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-(--muted) ml-1">Secure Key</label>
          <input
            className="input bg-(--surface-2)/50 border-(--border) focus:border-(--text) transition-all"
            type="password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-(--muted) ml-1">Team Code (Optional)</label>
          <input
            className="input bg-(--surface-2)/50 border-(--border) focus:border-(--text) transition-all"
            placeholder="Alpha / Beta / Gamma"
            value={teamCode}
            onChange={(event) => setTeamCode(event.target.value)}
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium rounded-lg animate-in shake-in duration-300">
            {error}
          </div>
        )}

        <button className="btn w-full py-3 text-sm font-bold tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition-all" type="submit" disabled={pending}>
          {pending ? "Processing..." : "Establish Identity"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-xs text-(--muted) uppercase tracking-widest font-bold">
          Already established?{" "}
          <Link
            className="text-(--text) hover:underline underline-offset-4"
            href={`/login?next=${encodeURIComponent(nextPath)}`}
          >
            Authorize Access
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
