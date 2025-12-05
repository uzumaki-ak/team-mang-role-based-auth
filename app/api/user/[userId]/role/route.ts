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
    const currentUser = await getCurrentUser();
    if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "you are not authorized to assign team",
        },
        { status: 401 }
      );
    }

    //preventing user from changing their own role
    if (userId === currentUser.id) {
      return NextResponse.json(
        {
          error: "u cant change your own role🤬",
        },
        { status: 401 }
      );
    }

    const { role } = await request.json();

    //checing if role is valid or not
    const validRoles = [Role.USER, Role.MANAGER];

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          errror: "invalid role ,blud u cant have more than one admin role 🤭",
        },
        { status: 404 }
      );
    }

    //if team found thne updte user team assignment

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
      },
      include: {
        team: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: `user role updated to ${role} successfully`,
    });
  } catch (error) {
    console.error("role assignment error", error);
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
