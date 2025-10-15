import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
 import {
  Attendance,
  AttendanceSchema,
  AttendanceArraySchema,
} from "@/lib/data/attendanceSchema";
import { decryptData, encryptData } from "@/lib/cryptoUtils";
const DATA_PATH = path.join(process.cwd(), "data/attendance.json");

export async function POST(req: Request) {
  try {
    const { userId, sessionId, timestamp } = await req.json();
    const newRecord = {
      userId,
      sessionId,
      timestamp: timestamp || new Date().toISOString(),
    };
     const parsed = AttendanceSchema.parse(newRecord); // ✅ Validate with Zod

    // Ensure folder exists
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });

    // Read existing file (or create if missing)
    let records: Attendance[] = [];
    try {
      const data = await fs.readFile(DATA_PATH, "utf-8");

     const decrypted = decryptData(data);
     records = AttendanceArraySchema.parse(decrypted); 
    } catch {
      records = [];
    }

    // Add new record and save
    records.push(parsed);
       const encrypted = encryptData(records);
    await fs.writeFile(DATA_PATH, encrypted, "utf-8");

    return NextResponse.json({ success: true, record: parsed });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function GET() {
  try {
const fileContent = await fs.readFile(DATA_PATH, "utf-8");
const decrypted = decryptData(fileContent);
const records = AttendanceArraySchema.parse(decrypted);
return NextResponse.json(records);
  } catch (err) {
    console.warn("GET Error or no data:", err);
    return NextResponse.json([]); // return empty if file not found or invalid
  }
}