import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getDB } from "@/lib/mongodb"; // MongoDB client
import { ObjectId } from "mongodb";

import nodemailer from "nodemailer";





export async function POST(req: NextRequest) {
  try {
    const date = new Date();
    const { Instructor, location, courseCode, sessionGroup, sessionType, tkn } =
      await req.json();

    // 1️⃣ Insert session into MongoDB
    const db = await getDB();

    const sessionDoc = {
      Instructor,
      location,
      courseCode,
      sessionType,
      tkn,
      sessionGroup,
      createdAt: date,
    };
    const result = await db.collection("sessions").insertOne(sessionDoc);
    const sessionId = result.insertedId.toString();

    const url = process.env.URL + "/students/" + tkn + "_" + sessionId;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <title>University Attendance System</title>
      </head>

      <body style="margin:0;padding:0;background:#eef2f7;font-family:Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:40px 0;">
      <tr>
      <td align="center">

      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.06);">

      <!-- Header -->
      <tr>
      <td style="padding:25px 30px;border-bottom:1px solid #e5e7eb;">

      <table width="100%">
      <tr>
      <td align="left" style="font-size:20px;font-weight:600;color:#1f2937;">
      RST Attendance System
      </td>

      <td align="right">
      <img src="cid:FCAIlogo" alt="FCAI Logo"   style="height:50px;" >
      <img src="cid:universitylogo" alt="University Logo"  style="height:50px;" >

      </td>

      </tr>
      </table>

      </td>
      </tr>

      <!-- Intro -->
      <tr>
      <td style="padding:35px 40px 10px 40px;color:#374151;font-size:16px;line-height:1.6;">
      Dear ${Instructor},<br><br>

      This is an automated notification from the <strong>University Attendance System</strong>.  
      I hope this message finds you well.

      Please find below the attendance details for your course:</td>
      </tr>

      <!-- Session Card -->
      <tr>
      <td style="padding:20px 40px;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:25px;">

      <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
      <span style="color:#6b7280;font-size:13px;">COURSE CODE</span><br>
      <span style="font-size:16px;font-weight:600;color:#111827;">${courseCode}</span>
      </td>
      </tr>

      <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
      <span style="color:#6b7280;font-size:13px;">SESSION TYPE</span><br>
      <span style="font-size:16px;font-weight:600;color:#111827;">${sessionType}</span>
      </td>
      </tr>

      <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
      <span style="color:#6b7280;font-size:13px;">DATE & TIME</span><br>
      <span style="font-size:16px;font-weight:600;color:#111827;">${date.toLocaleString(
        "en-US",
        {
          timeZone: "Africa/Cairo",
        },
      )}</span>
      </td>
      </tr>

      <tr>
      <td style="padding:12px 0;">
      <span style="color:#6b7280;font-size:13px;">LOCATION</span><br>
      <span style="font-size:16px;font-weight:600;color:#111827;">${location}</span>
      </td>
      </tr>

      </table>

      </td>
      </tr>

      <!-- CTA -->
      <tr>
      <td align="center" style="padding:20px 40px 35px 40px;">
      <a href="${url}" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 34px;font-size:15px;font-weight:600;border-radius:8px;display:inline-block;">
      Show all students</a>
      </td>
      </tr>
      <!-- Footer -->
      <tr>
      <td style="background:#f9fafb;padding:25px 40px;text-align:center;font-size:13px;color:#6b7280;border-top:1px solid #e5e7eb;line-height:1.6;">
      <img src="cid:companylogo" alt="Company Logo" style="height:45px;" >
      <br/>
      <strong>University Attendance System</strong><br>
      Automated Academic Notification Service<br><br>
      Please do not reply to this email.  
      If you received this message in error, kindly disregard it.
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </table>
      </body>
      </html>
        `.trim();
    // const { to, subject, text } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail", // Example: Gmail SMTP
      // host: "smtp.office365.com",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: "clarkwagdy1@gmail.com",
        pass: "gist xnnp fnaa xkha", // App password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: "clarkwagdy1@gmail.com",
      to: "clark.wagdy@rst.edu.eg",
      subject: `Attendance Notification for ${courseCode} - ${sessionType}- ${date.toLocaleString(
        "en-US",
        {
          timeZone: "Africa/Cairo",
        },
      )}`,

      html,
      attachments: [
        {
          filename: "university-logo.png",

          path: path.join(
            process.cwd(),
            "public/email-assets/university-logo.png",
          ), // path relative to project root
          cid: "universitylogo", // must match src="cid:universitylogo"
        },
        {
          filename: "FCAI-logo.png",
          path: path.join(process.cwd(), "public/email-assets/fcai2.png"), // path relative to project root
          cid: "FCAIlogo", // must match src="cid:FCAIlogo"
        },
        {
          filename: "company-logo.png",
          path: path.join(process.cwd(), "public/email-assets/One.1.png"), // path relative to project root
          cid: "companylogo", // must match src="cid:companylogo"
        },
      ],
    });

    return NextResponse.json({
      success: true,
      sessionId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to send email" });
  }
}

export async function PUT(req: Request) {
  try {
    const { sessionId, tkn } = await req.json();

    if (!sessionId || !tkn) {
      return NextResponse.json(
        { success: false, error: "sessionId and tkn are required" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const result = await db.collection("sessions").updateOne(
      { _id: new ObjectId(sessionId) },
      {
        $set: {
          tkn,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token updated successfully",
    });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update token" },
      { status: 500 },
    );
  }
}