import { getCurrentUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "you are not authenticated",
        },
        { status: 401 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in fetching current user:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
