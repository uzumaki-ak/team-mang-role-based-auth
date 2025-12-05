import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const user = await getCurrentUser();
    if (!user || !checkUserPermission(user, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "you are not authorized to assign team",
        },
        { status: 401 }
      );
    }
    const { teamId } = await request.json();
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });
      if (!team) {
        return NextResponse.json(
          {
            errror: "team not found🤭",
          },
          { status: 404 }
        );
      }
    }

    //if team found thne updte user team assignment

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        teamId: teamId,
      },
      include: {
        team: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: teamId ? "user assigned sxfully🤠" : "i just kicked him🤣",
    });
  } catch (error) {
    console.error("team assignment error", error);
    if (
      error instanceof Error &&
      error.message.includes("record to update not found")
    ) {
      return NextResponse.json(
        {
          error: "user not found 😶‍🌫️",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        error: "internL servrr errror 🤘",
      },
      { status: 500 }
    );
  }
}
