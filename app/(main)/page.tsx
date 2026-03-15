import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    // Simple landing page for guests
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="space-y-4">
          <div className="label text-(--muted)">WORKSPACE</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter" style={{ fontFamily: 'var(--font-barlow)' }}>
            ACCESS CORE
          </h1>
          <p className="text-(--muted) max-w-md mx-auto">
            A premium, role-based team management system designed for focus and clarity.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="btn px-8">Sign In</Link>
          <Link href="/register" className="btn btn-ghost px-8">Join</Link>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === Role.ADMIN;
  const isManager = user.role === Role.MANAGER;

  // Stats for the dashboard
  const userCount = isAdmin 
    ? await prisma.user.count() 
    : await prisma.user.count({ where: { teamId: user.teamId } });
    
  const teamCount = await prisma.team.count();
  
  const managerCount = isAdmin 
    ? await prisma.user.count({ where: { role: Role.MANAGER } })
    : 0;

  const collections = [
    { 
      title: isAdmin ? "Users" : "Teammates", 
      count: userCount, 
      href: "/users", 
      show: true, 
      icon: "👤" 
    },
    { 
      title: "Teams", 
      count: teamCount, 
      href: "/teams", 
      show: isAdmin || isManager, 
      icon: "👥" 
    },
    { 
      title: "Managers", 
      count: managerCount, 
      href: "/users?role=MANAGER", 
      show: isAdmin, 
      icon: "👔" 
    },
  ];

  const controls = [
    { title: "Audit Log", href: "/audit-log", show: isAdmin, icon: "📋" },
    { title: "Profile", href: "/profile", show: true, icon: "⚙️" },
  ];

  return (
    <div className="space-y-12 max-w-6xl">
      <section>
        <div className="label mb-6">Collections</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.filter(c => c.show).map((col) => (
            <Link key={col.title} href={col.href} className="panel p-6 hover:border-(--text) transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <div className="label text-[10px] mb-4">{col.title}</div>
                  <div className="text-4xl font-bold" style={{ fontFamily: 'var(--font-barlow)' }}>{col.count}</div>
                </div>
                <div className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity">
                  {col.icon}
                </div>
              </div>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-(--muted) group-hover:text-(--text)">
                Manage {col.title} <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="label mb-6">Admin Controls</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {controls.filter(c => c.show).map((ctrl) => (
             <Link key={ctrl.title} href={ctrl.href} className="panel p-6 hover:border-(--text) transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="label text-[10px] mb-4">{ctrl.title}</div>
                    <div className="text-xl font-bold uppercase tracking-tight" style={{ fontFamily: 'var(--font-orbitron)' }}>
                      {ctrl.title}
                    </div>
                  </div>
                  <div className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity">
                    {ctrl.icon}
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-(--muted) group-hover:text-(--text)">
                  Access <span>→</span>
                </div>
             </Link>
          ))}
        </div>
      </section>

      {user.role === Role.GUEST && (
        <section className="panel p-8 bg-(--surface-2) border-dashed border-2">
           <div className="max-w-md">
             <div className="label mb-4">Account Pending</div>
             <h3 className="text-2xl font-bold mb-2">Welcome, {user.name || "Colleague"}</h3>
             <p className="text-sm text-(--muted)">
                You currently have GUEST access. An administrator needs to assign you a role and team before you can access the full workspace collections.
             </p>
           </div>
        </section>
      )}
    </div>
  );
};

export default Page;
