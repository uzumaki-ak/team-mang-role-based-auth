"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Role } from "@/app/types";

const Sidebar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        // Silent fail for guest
      }
    };
    fetchUser();
  }, []);

  const isAdmin = user?.role === Role.ADMIN;
  const isManager = user?.role === Role.MANAGER;
  const canManage = isAdmin || isManager;

  const collections = [
    { label: "Users", href: "/users", show: !!user },
    { label: "Teams", href: "/teams", show: canManage },
  ];

  const adminControls = [
    { label: "Audit Log", href: "/audit-log", show: isAdmin },
  ];

  const core = [
    { label: "Overview", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/profile" },
  ];

  const NavLink = ({ link }: { link: { label: string; href: string } }) => {
    const isActive = pathname === link.href;
    return (
      <Link
        href={link.href}
        className={`nav-link ${isActive ? "active" : ""}`}
      >
        <span>{link.label}</span>
      </Link>
    );
  };

  return (
    <aside className="app-sidebar">
      <div className="mb-10">
        <div className="label mb-1">Workspace</div>
        <Link href="/" className="brand">Access Core</Link>
      </div>

      <nav className="space-y-8">
        <div className="nav-group">
          <div className="label mb-3">General</div>
          <div className="flex flex-col gap-1">
            {core.map((link) => (
              <NavLink key={link.href} link={link} />
            ))}
          </div>
        </div>

        {collections.some(l => l.show) && (
          <div className="nav-group">
            <div className="label mb-3">Collections</div>
            <div className="flex flex-col gap-1">
              {collections.filter(l => l.show).map((link) => (
                <NavLink key={link.href} link={link} />
              ))}
            </div>
          </div>
        )}

        {adminControls.some(l => l.show) && (
          <div className="nav-group">
            <div className="label mb-3">Admin Controls</div>
            <div className="flex flex-col gap-1">
              {adminControls.filter(l => l.show).map((link) => (
                <NavLink key={link.href} link={link} />
              ))}
            </div>
          </div>
        )}

        {!user && (
          <div className="nav-group">
            <div className="label mb-3">Shortcuts</div>
            <div className="flex flex-col gap-1">
              <Link className="nav-link" href="/login">Sign in</Link>
              <Link className="nav-link" href="/register">Create account</Link>
            </div>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[10px] uppercase font-bold">
            {user?.name?.[0] || user?.email?.[0] || "?"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-medium truncate">{user?.name || user?.email || "Guest"}</span>
            <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{user?.role || "GUEST"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
