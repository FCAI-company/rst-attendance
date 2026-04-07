"use client";
import { useEffect, useState } from "react"; 
import { CheckCircle2, Camera, QrCode } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { useParams } from "next/navigation";
import QRScanner from "../QRScanner";
 
interface CooldownData {
  timestamp: number;
  studentId: string;
}

const STORAGE_KEY = "attendance_cooldown";
const StudentId_KEY = "studentId";
const COOLDOWN_DURATION = 10 * 60 * 1000;
export default function CheckinPage() {

    const { id } = useParams(); 
  
  const [studentId, setStudentId] = useState<string>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [istimeout, setistimeout] = useState(false);
  const [message, setmessage] = useState("");

  const [SEC, setSEC] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  


const startCooldown = (studentId: string) => {
  setIsSubmitted(true);
  const cooldownData: CooldownData = {
    timestamp: Date.now(),
    studentId,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cooldownData));
};

function secondsBetween(time1: string): number {
  const t1 = new Date(Number(time1));
  const t2 = new Date(Date.now());
  const diffMs = t2.getTime() - t1.getTime();
  return diffMs / 1000;
}



  useEffect(() => {
        if (!navigator.geolocation) {
          alert("Geolocation not supported");
          return;
        }
        if(!id){
              return;
        }
        const sessionId = id.toString().split('_')[1] as string;
        let sec = secondsBetween(sessionId.toString());
       setSEC(sec);
        if (sec >= 60) {
          setistimeout(true);
        }

      const stored = localStorage.getItem(STORAGE_KEY);
      const storedStudentId = localStorage.getItem(StudentId_KEY);
      if (storedStudentId) {
        setStudentId(storedStudentId);
        handleSubmit(storedStudentId);
      }
      if (stored) {
        try {
          const data: CooldownData = JSON.parse(stored);
          const elapsed = Date.now() - data.timestamp;
            
          if (elapsed < COOLDOWN_DURATION) {
           setIsSubmitted(true);
          } else {
            // Cooldown expired, clear it
            localStorage.removeItem(STORAGE_KEY);
           setIsSubmitted(false);
          }
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
  }, []);
  const handleSubmit = async (storedStudentId?:string) => {
    if (!storedStudentId?.trim()) {
      setmessage("Please enter your Student ID");
      return;
    }
    let lat, lng;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Latitude:", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      },
      (error) => {
        console.error(error);
      },
    );
    fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storedStudentId,
        sessionId: id,
        lat,
        lng,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem(StudentId_KEY, storedStudentId);
          startCooldown(storedStudentId);
        }
      })
      .catch(() => {
        console.log(
          "An error occurred while submitting attendance. Please try again.",
        );
      });
    setIsSubmitted(false);
    setStudentId("");
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

        {istimeout ? (
          <CardContent className="space-y-6">
            <h2 className="text-center text-red-700 font-bold">Time is up, please rescan the code.</h2>
            <QRScanner />
          </CardContent>
        ) : (
          <CardContent className="space-y-6">
            {/* Manual Student ID Entry */}

            <div className="space-y-2">
              <Label htmlFor="studentId">Enter Student ID</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="e.g., 2024001"
                value={studentId?.trim() || ""}
                onChange={(e) => setStudentId(e.target.value)}
                className="h-12 bg-input-background border-border"
                disabled={isSubmitted}
              />
            </div>

            <Button
              onClick={()=>handleSubmit(studentId || "")}
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
        )}
      </Card>
    </div>
  );
}
 