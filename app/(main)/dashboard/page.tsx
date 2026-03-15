import { getActivityFeed } from "@/app/lib/activity";
import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/guards";
import { Role } from "@prisma/client";

const DashboardPage = async () => {
  await requireUser("/dashboard");
  const [userCount, teamCount, managerCount, activity] = await Promise.all([
    prisma.user.count(),
    prisma.team.count(),
    prisma.user.count({ where: { role: Role.MANAGER } }),
    getActivityFeed(6),
  ]);

  const stats = [
    { label: "Users", value: userCount.toString() },
    { label: "Teams", value: teamCount.toString() },
    { label: "Managers", value: managerCount.toString() },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="panel p-6">
            <div className="label">{stat.label}</div>
            <div className="text-3xl font-semibold mt-4">{stat.value}</div>
          </div>
        ))}
      </section>

      <section className="panel p-6">
        <div className="label">Activity feed</div>
        <div className="mt-4 space-y-4">
          {activity.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-[var(--border)] pb-3 last:border-b-0 last:pb-0"
            >
              <div>
                <div className="text-sm font-medium">{item.title}</div>
                <div className="muted text-xs">{item.meta}</div>
              </div>
              <div className="muted text-xs">
                {item.timestamp.toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
