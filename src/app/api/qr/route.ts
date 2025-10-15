import { NextResponse } from "next/server";
import { addRecord, readRecords, updateRecord } from "@/lib/instructor/qrinfo";
import { decryptData } from "@/lib/cryptoUtils";

export async function GET() {
  const data = readRecords();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  addRecord({ ...body, timestamp: new Date().toISOString() });
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const body = await req.json();
  console.log("PUT body:", body);
 
  updateRecord(body.split("_")[0], body.split("_")[1]);
  return NextResponse.json({ success: true });
}
