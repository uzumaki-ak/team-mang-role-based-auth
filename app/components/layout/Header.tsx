"use client";

import { User } from "@/app/types";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type SafeUser = Pick<User, "id" | "name" | "email" | "role" | "teamId"> & {
  team?: { id: string; name: string } | null;
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (!response.ok) {
          if (active) setUser(null);
          return;
        }
        const data = (await response.json()) as SafeUser;
        if (active) setUser(data);
      } catch (error) {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUser();
    return () => {
      active = false;
    };
  }, []);

  const { title, crumbs } = useMemo(() => {
    if (!pathname) return { title: "Overview", crumbs: [] };
    const segments = pathname.split("/").filter(Boolean);
    const label = segments.length ? segments[segments.length - 1] : "Overview";
    const pretty = label.replace(/-/g, " ");
    
    // Breadcrumb array for mapping
    const crumbs = segments.map((s, i) => ({
      label: s.replace(/-/g, " "),
      href: "/" + segments.slice(0, i + 1).join("/")
    }));

    return { title: pretty, crumbs };
  }, [pathname]);

  const loginNext = pathname && pathname !== "/" ? pathname : "/dashboard";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      router.refresh();
    }
  };

  return (
    <header className="app-header">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-(--muted) mb-1">
          <Link href="/" className="hover:text-(--text) transition-colors">WORKSPACE</Link>
          {title !== "Overview" && <span className="opacity-30">/</span>}
          {title !== "Overview" && (
            <span className="text-(--text)">{title}</span>
          )}
        </div>
        <h1 className="page-title capitalize" style={{ fontFamily: 'var(--font-barlow)' }}>{title}</h1>
      </div>

      <div className="flex items-center gap-5">
        <ThemeToggle />
        
        {!loading && user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold">{user.name || "User"}</span>
              <span className="text-[10px] uppercase font-bold text-(--muted)">{user.role}</span>
            </div>
            <button 
              className="btn btn-ghost text-xs px-3 py-1.5"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        ) : (
          !loading && (
            <div className="flex items-center gap-3">
              <Link
                className="btn btn-ghost text-xs px-3 py-1.5"
                href={`/login?next=${encodeURIComponent(loginNext)}`}
              >
                Sign in
              </Link>
              <Link
                className="btn text-xs px-4 py-1.5"
                href={`/register?next=${encodeURIComponent(loginNext)}`}
              >
                Join
              </Link>
            </div>
          )
        )}
      </div>
    </header>
  );
};

export default Header;
