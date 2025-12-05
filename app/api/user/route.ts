import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Prisma, Role } from "@prisma/client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "you are not authenticated",
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("teamId");
    const role = searchParams.get("role");

    //where clause based on user role
    const where: Prisma.UserWhereInput = {};
    if (user.role == Role.ADMIN) {
      //admin can see all users or filter by teamId and role
    } else if (user.role == Role.MANAGER) {
      //manager can see users in their team or cross team user but can not see other managers or admins
      where.OR = [{ teamId: user.teamId }, { role: Role.USER }];
    } else {
      //regular user can see only users in their team
      where.teamId = user.teamId;
      where.role = { not: Role.ADMIN };
    }

    //filters
    if (teamId) {
      where.teamId = teamId;
    }
    if (role) {
      where.role = role as Role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error in fetching users:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
