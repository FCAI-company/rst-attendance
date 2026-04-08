import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
// import { studentDT } from "@/lib/data/student";
// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");
import students from "@/lib/data/students.json";
import { ObjectId } from "mongodb";
import { success } from "zod";
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
    const session = await db
      .collection("sessions")
      .findOne({ _id: new ObjectId(sessionId) });
      
    return NextResponse.json({ success: true, data, session });
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
    const { studentId, sessionId, lat, lng, location, visitorId } =
      (await request.json()) as {
        studentId: StudentKeys;
        sessionId: string;
        lat: number;
        lng: number;
        visitorId: string;
        location: string;
      };

    if (!studentId || !sessionId) {
      return NextResponse.json(
        { error: "Missing studentId or sessionId" },
        { status: 400 },
      );
    }



    const date = new Date();
    const db = await getDB();
    // let sid:string = studentId;

    const existingDevice = await db.collection("attendance").findOne({
      sessionId: sessionId.split("_")[2],
      visitorId: visitorId,
    });

    if (existingDevice && existingDevice.studentId !== studentId) {
      return NextResponse.json(
        { success: false, error: "You are already checked." },
        { status: 403 },
      );
    }
    const sid: StudentKeys = studentId;
    const result = await db.collection("attendance").insertOne({
      studentName: students[sid]?.name || "Unknown Student",
      studentId,
      lat,
      lng,
      location,
      visitorId,
      sessionId: sessionId.split("_")[2],
      timestamp: date.toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      }),
    });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error:any) {
  console.error("Error recording attendance:", error);
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
