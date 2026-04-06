import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
// import { studentDT } from "@/lib/data/student";
// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");
import macaddress from "macaddress";

import students from "@/lib/data/students.json";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const db = await getDB();

    const data = await db
      .collection("attendance")
      .find({ sessionId })
      .toArray();

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    type StudentKeys = keyof typeof students;
    const { studentId, sessionId, lat, lng, macAddress } = (await request.json()) as {
      studentId: StudentKeys;
      sessionId: string;
      lat: number;
      lng: number;
      macAddress?: string;
    };

    if (!studentId || !sessionId) {
      return NextResponse.json(
        { error: "Missing studentId or sessionId" },
        { status: 400 }
      );
    }

    const db = await getDB();

    // Get client MAC if not provided (only server MAC fallback)
    const mac = macAddress || (await macaddress.one());

    // Check if this MAC has already submitted for this session
    const existing = await db.collection("attendance").findOne({
      sessionId,
      macAddress: mac,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already submitted attendance for this session" },
        { status: 403 } // Forbidden
      );
    }

    // Insert attendance record
    const date = new Date();
    const sid: StudentKeys = studentId;
    const result = await db.collection("attendance").insertOne({
      studentName: students[sid]?.name || "Unknown Student",
      studentId,
      lat,
      lng,
      sessionId,
      timestamp: date.toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      }),
      macAddress: mac,
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    console.error("Error recording attendance:", error);
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
};