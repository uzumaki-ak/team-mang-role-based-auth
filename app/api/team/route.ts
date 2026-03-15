import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "you are not authenticated" },
        { status: 401 }
      );
    }

    const query = request.nextUrl.searchParams.get("q")?.trim();

    let whereClause: any = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { code: { contains: query, mode: "insensitive" } },
          ],
        }
      : {};

    if (user.role !== Role.ADMIN) {
      whereClause = {
        AND: [whereClause, { id: user.teamId || "none" }],
      };
    }

    const teams = await prisma.team.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        code: true,
        _count: {
          select: { members: true },
        },
      },
    });

    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Error in fetching teams:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !checkUserPermission(user, Role.ADMIN)) {
      return NextResponse.json(
        { error: "you are not authorized to create teams" },
        { status: 401 }
      );
    }

    const { name, description, code } = await request.json();
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedCode = typeof code === "string" ? code.trim() : "";
    const trimmedDescription =
      typeof description === "string" ? description.trim() : undefined;

    if (!trimmedName || !trimmedCode) {
      return NextResponse.json(
        { error: "name and code are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.team.findFirst({
      where: {
        OR: [{ name: trimmedName }, { code: trimmedCode }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "team already exists with this name or code" },
        { status: 409 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name: trimmedName,
        description: trimmedDescription,
        code: trimmedCode,
      },
      select: {
        id: true,
        name: true,
        description: true,
        code: true,
        _count: {
          select: { members: true },
        },
      },
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Error in creating team:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
