import { checkUserPermission, getCurrentUser, hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const generateTempPassword = () => randomBytes(6).toString("base64url");

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentUser();
    if (!admin || !checkUserPermission(admin, Role.ADMIN)) {
      return NextResponse.json(
        { error: "you are not authorized to invite users" },
        { status: 401 }
      );
    }

    const { name, email, role, teamId, password, mode } =
      await request.json();

    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }

    const trimmedName = typeof name === "string" ? name.trim() : undefined;

    const allowedRoles = [Role.USER, Role.MANAGER, Role.GUEST];
    const nextRole = allowedRoles.includes(role) ? role : Role.USER;

    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });
      if (!team) {
        return NextResponse.json({ error: "team not found" }, { status: 404 });
      }
    }

    const existing = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "user already exists with this email" },
        { status: 409 }
      );
    }

    let tempPassword: string | undefined;
    if (mode === "invite" || !password) {
      tempPassword = generateTempPassword();
    }

    const finalPassword =
      tempPassword || (typeof password === "string" ? password.trim() : "");
    if (!finalPassword || finalPassword.length < 6) {
      return NextResponse.json(
        { error: "password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: trimmedName || null,
        email: trimmedEmail,
        password: await hashPassword(finalPassword),
        role: nextRole,
        teamId: teamId || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        team: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({
      user,
      temporaryPassword: tempPassword,
      mode: mode || "create",
    });
  } catch (error) {
    console.error("Error in inviting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
