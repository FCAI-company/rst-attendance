import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";

export async function POST(request: Request) {
 
  try {
    const { studentId, sessionId, lat, lng } = await request.json();

    if (!studentId || !sessionId) {
      return NextResponse.json(
        { error: "Missing studentId or sessionId" },
        { status: 400 },
      );
    }
 


    const date = new Date();

    const db = await getDB();
    const result = await db.collection("attendance").insertOne({
      studentId,
      lat,
      lng,
      sessionId, 
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
