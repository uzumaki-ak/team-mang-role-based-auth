import { checkDatabaseConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET () {
const isDBconnected= await checkDatabaseConnection();
if(!isDBconnected) {
  return NextResponse.json({status: 'error', message: 'Database connection failed'}, {status: 500});
}
return NextResponse.json({status: 'ok', message: 'API is working fine'}, {status: 200});
}