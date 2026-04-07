"use client";

import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Download,
  Users,
  MapPin,
  Clock,
  FileSpreadsheet,
  Calendar,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface AttendanceRecord {
  _id: string;
  studentId: string;
  studentName: string;
  location: string;
  // checkInTime: string;
  timestamp: string;
}

interface SessionInfo {
  sessionId: string;
  courseCode: string;
  sessionType: string;
  location: string;
  sessionDate: string;
  totalStudents: number;
}

export default function AttendanceReportScreen() {
  const { id } = useParams() as { id: string };
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from database/API
    // In production, you would fetch this from your backend using the reportId
   
      setIsLoading(true);

      // Mock data - replace with actual API call
    
        const mockSessionInfo: SessionInfo = {
          sessionId: decodeURIComponent(id) + "" || "unknown",
          courseCode: decodeURIComponent(id)?.split("-")[1].toUpperCase() || "UNKNOWN",
          sessionType: decodeURIComponent(id)?.split("-")[0].toUpperCase() || "UNKNOWN",
          location: decodeURIComponent(id)?.split("_")[0].split("-")[2].toUpperCase() || "UNKNOWN",
          sessionDate: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          totalStudents: 0,
        };
        fetch(`/api/attendance?sessionId=${id.toString().split('_')[2]}`)
          .then((res) => res.json())
          .then((data) => {
            console.log("Fetched attendance data:", data);
             mockSessionInfo.totalStudents = data.data.length;

             setSessionInfo(mockSessionInfo);
             setAttendanceRecords(data.data);
             setIsLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching attendance data:", err);
          });

    

       
     
    
  }, [id]);

  const downloadExcel = () => {
    if (!attendanceRecords.length || !sessionInfo) return;

    // Prepare data for Excel
    const excelData = attendanceRecords.map((record, index) => ({
      "No.": index + 1,
      "Student ID": record.studentId,
      "Student Name": record.studentName,
      Location: record.location,
      "Check-in Time": record.timestamp,
      "Full Timestamp": record.timestamp.toLocaleString(),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 5 }, // No.
      { wch: 12 }, // Student ID
      { wch: 20 }, // Student Name
      { wch: 25 }, // Location
      { wch: 15 }, // Check-in Time
      { wch: 25 }, // Full Timestamp
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Add session info as a second sheet
    const sessionSheet = XLSX.utils.json_to_sheet([
      { Field: "Session ID", Value: sessionInfo.sessionId },
      { Field: "Course Code", Value: sessionInfo.courseCode },
      { Field: "Session Type", Value: sessionInfo.sessionType },
      { Field: "Location", Value: sessionInfo.location },
      { Field: "Date", Value: sessionInfo.sessionDate },
      { Field: "Total Students", Value: sessionInfo.totalStudents },
    ]);
    XLSX.utils.book_append_sheet(workbook, sessionSheet, "Session Info");

    // Generate filename
    const filename = `Attendance_${sessionInfo.courseCode}_${sessionInfo.sessionId}_${new Date().toISOString().split("T")[0]}.xlsx`;

    // Download
    XLSX.writeFile(workbook, filename);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading attendance report...</p>
        </div>
      </div>
    );
  }

  if (!sessionInfo || !attendanceRecords.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No attendance records found for this session.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Session Info Card */}
        <Card className="shadow-lg border-border mb-6">
          <CardHeader>
            <div className="text-left">
              <h1 className="text-primary mb-1">Attendance Report</h1>
              <p className="text-muted-foreground">
                {sessionInfo.courseCode}
                 {/* - {sessionInfo.sessionType} */}
              </p>
            </div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Session Information
            </CardTitle>
            <CardDescription>
              Details about this attendance session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="text-sm font-medium">Course</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {sessionInfo.courseCode}
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Session Type</span>
                </div>
                <p className="text-lg font-bold text-purple-900">
                  {sessionInfo.sessionType}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="text-lg font-bold text-green-900">
                  {sessionInfo.location}
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Total Students</span>
                </div>
                <p className="text-lg font-bold text-orange-900">
                  {sessionInfo.totalStudents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance List Card */}
        <Card className="shadow-lg border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Student Attendance List
                </CardTitle>
                <CardDescription>
                  All students who checked in for this session
                </CardDescription>
              </div>
              <Button onClick={downloadExcel} className="sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Download Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      #
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Student ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Student Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Check-in Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => (
                    <tr
                      key={record._id}
                      className="border-b border-border hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">{index + 1}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primary">
                        {record.studentId}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.studentName}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {record.location}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {record.timestamp.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {attendanceRecords.map((record, index) => (
                <div
                  key={record._id}
                  className="bg-white border border-border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-primary">
                        {record.studentName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID: {record.studentId}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {record.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {record.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
