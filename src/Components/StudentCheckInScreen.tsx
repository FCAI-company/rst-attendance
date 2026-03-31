"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CheckCircle2, Camera, QrCode } from "lucide-react";

export function StudentCheckInScreen() {
  const [studentId, setStudentId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any>(null);

  const handleSubmit = () => {
    if (!studentId.trim()) {
      alert("Please enter your Student ID");
      return;
    }

    // Simulate attendance submission
    setAttendanceData({
      studentId,
      timestamp: new Date().toLocaleString(),
    });
    setIsSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setStudentId("");
      setAttendanceData(null);
    }, 3000);
  };

  const handleScanSimulation = () => {
    // Simulate QR code scan
    alert(
      "QR Scanner activated! In a real app, this would open the camera to scan the QR code.",
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-primary">Student Attendance Check-In</h1>
        <p className="text-muted-foreground">Scan QR code or enter your ID</p>
      </div>

      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle>Check In</CardTitle>
          <CardDescription>
            Mark your attendance for today's session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Scanner Placeholder */}
          <div className="space-y-2">
            <Label>QR Code Scanner</Label>
            <div
              onClick={handleScanSimulation}
              className="relative bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-dashed border-primary/30 rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Scanner frame corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>

                  <div className="w-48 h-48 flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-primary/40 group-hover:text-primary/60 transition-colors" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4">
                <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-sm">
                  <Camera className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary">
                    Tap to Scan QR Code
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Manual Student ID Entry */}
          <div className="space-y-2">
            <Label htmlFor="studentId">Enter Student ID</Label>
            <Input
              id="studentId"
              type="text"
              placeholder="e.g., 2024001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-12 bg-input-background border-border"
              disabled={isSubmitted}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full h-14 text-lg"
            disabled={isSubmitted}
          >
            {isSubmitted ? "Submitted!" : "Submit Attendance"}
          </Button>

          {/* Success Message */}
          {isSubmitted && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-green-800">
                    ✅ Attendance Recorded Successfully
                  </p>
                  {attendanceData && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-green-700">
                        Student ID: {attendanceData.studentId}
                      </p>
                      <p className="text-sm text-green-700">
                        Time: {attendanceData.timestamp}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Make sure you're in the correct session
              before submitting your attendance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
