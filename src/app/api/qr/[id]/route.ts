import { NextRequest, NextResponse } from "next/server";
;
import { getDB } from "@/lib/mongodb"; // MongoDB client
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const session = await db
      .collection("sessions")
      .findOne({ _id: new ObjectId(id) });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("GET session error:", error);

    return NextResponse.json(
      { success: false, error: "Invalid session ID or server error" },
      { status: 500 },
    );
  }
}
