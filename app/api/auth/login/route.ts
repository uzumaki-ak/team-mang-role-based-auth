import { generateToken, hashPassword, verifyPasword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@prisma/client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email,  password, teamCode } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "missing-email;password",
        },
        { status: 400 }
      );
    }

    //existing user check
    const userFromDb = await prisma.user.findUnique({
      where: { email },
      include: { team: true },
    });
 

if (!userFromDb) {
  return NextResponse.json({
    error: "Invalid email or password",
  },{ status: 401 });
}

//valid password
const isValidPAssword = await verifyPasword(password, userFromDb.password);
if (!isValidPAssword) {
  return NextResponse.json({
    error: "Invalid email or password",
  },{ status: 401 });
}


    //generate token for user
    const token = generateToken(userFromDb.id);

    //return response
    const response = NextResponse.json({
      user: {
        id: userFromDb.id,
        name: userFromDb.name,
        email: userFromDb.email,
        role: userFromDb.role,
        teamId: userFromDb.teamId,
        team: userFromDb.team,
        token,
      },
    });

    //set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return response;
  } catch (error) {
    console.error("Error in login failed:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
