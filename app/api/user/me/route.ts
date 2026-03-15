import { getCurrentUser, hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "you are not authenticated" },
        { status: 401 }
      );
    }

    const { name, email, password } = await request.json();

    const data: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (typeof name === "string" && name.trim()) {
      data.name = name.trim();
    }

    if (typeof email === "string" && email.trim()) {
      const normalizedEmail = email.trim();
      if (normalizedEmail !== user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
        if (existing) {
          return NextResponse.json(
            { error: "email already in use" },
            { status: 409 }
          );
        }
      }
      data.email = normalizedEmail;
    }

    if (typeof password === "string" && password.trim()) {
      if (password.trim().length < 6) {
        return NextResponse.json(
          { error: "password must be at least 6 characters" },
          { status: 400 }
        );
      }
      data.password = await hashPassword(password.trim());
    }

    if (!data.name && !data.email && !data.password) {
      return NextResponse.json(
        { error: "no changes submitted" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
        team: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Error in updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
