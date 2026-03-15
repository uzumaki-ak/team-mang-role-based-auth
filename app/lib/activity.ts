import { prisma } from "@/app/lib/db";

export type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  timestamp: Date;
  type: "user" | "team";
};

export const getActivityFeed = async (limit = 12) => {
  const [users, teams] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        team: { select: { name: true } },
      },
    }),
    prisma.team.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        code: true,
        createdAt: true,
        _count: { select: { members: true } },
      },
    }),
  ]);

  const activity: ActivityItem[] = [
    ...users.map((user) => ({
      id: `user-${user.id}`,
      type: "user" as const,
      title: `${user.name || user.email} joined`,
      meta: `${user.role}${user.team?.name ? ` - ${user.team.name}` : ""}`,
      timestamp: user.createdAt,
    })),
    ...teams.map((team) => ({
      id: `team-${team.id}`,
      type: "team" as const,
      title: `Team created: ${team.name}`,
      meta: `${team._count.members} members`,
      timestamp: team.createdAt,
    })),
  ];

  return activity
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};
