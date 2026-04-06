"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import crypto from "crypto";
 

// Create a hash object

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import QRCode from "qrcode";
import { ScheduleEntry } from "@/lib/data/schedule";
import { getSchedule } from "@/lib/handle/getdata";
import { getTkn } from "@/lib/gettkn";

export function InstructorSetupScreen() {
  const [location, setLocation] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [Instructor, setInstructor] = useState("");
const [error, seterror] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [sessionGroup, setSessionGroup] = useState("");
  const [sessionId, setsessionId] = useState("");

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSend, setIssend] = useState(false);

  const [timeLeft, setTimeLeft] = useState(60);
  const [Schedules, setSchedules] = useState<ScheduleEntry[]>([]);

useEffect(() => {
  const data = getSchedule() as ScheduleEntry[];
  if (!Array.isArray(data)) {
    setSchedules([]);
    return;
  }

  const unique = [...new Map(data.map((s) => [s.Hall, s])).values()];
  setSchedules(unique);

  const location = localStorage.getItem("location");
  if (location && unique.some((s) => s.Hall === location)) {
    handleChange(location, unique);
  }
}, []);

    useEffect(() => {
      if (qrCodeUrl) {
        if (timeLeft <= 0) {

          generateanotherQRCode().then(() => {
            setTimeLeft(60);
          });
        }
        const timer = setInterval(() => {
          setTimeLeft((t) => t - 1);
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [timeLeft, qrCodeUrl]);
// const hash = crypto.createHash("sha256");

 

const GenTkn = async() => {
     const sessionid =
       sessionType +
       "-" +
       courseCode +
       "-" +
       location +
       "_" +
       Date.now();
      //  const tkn = crypto.randomBytes(16).toString("hex");
 
  return `${sessionid.replace(/\s/g, "")}`;
};

const generateanotherQRCode = async () => {
   setIsGenerating(true);
  if (!location || !courseCode || !sessionType ||!sessionId) {
    seterror("Please fill in all fields");
    setIsGenerating(false);
    return;
  }

     try {
       const tkn = await GenTkn();
       if (!isSend) {
    
            
             const url = await QRCode.toDataURL(
               `${window.location.origin}/checkin/${getTkn}_${sessionId}`,
               {
                 width: 300,
                 margin: 2,
                 color: {
                   dark: "#2563eb",
                   light: "#ffffff",
                 },
               },
             );
              setQrCodeUrl(url);
             
        
       }
     } catch (error) {
       console.error("Error generating QR code:", error);
       alert("Failed to generate QR code");
     } finally {
       setIsGenerating(false);
     }
  

}
  const generateQRCode = async () => {
    // const ress = await fetch("/api/qr");
    // const datas = await ress.json();
      
 

    // if (!location || !courseCode || !sessionType) {
    //   alert("Please fill in all fields");
    //   return;
    // }


 

    setIsGenerating(true);

    // const attendanceData = JSON.stringify({
    //   location,
    //   courseCode,
    //   sessionType,
    //   timestamp: new Date().toISOString(),
    // });
if (!location || !courseCode || !sessionType) {
      seterror("Please fill in all fields");
      setIsGenerating(false);
      return;
    }
    try {
      const tkn=await GenTkn();
         if (!isSend) {
          fetch("/api/qr", {
            method: "post",
            body: JSON.stringify({
              location,
              courseCode,
              Instructor,
              sessionType,

              tkn,
            }),
          })
            .then((res) => res.json())
            .then(async (data) => {
              setsessionId(data.sessionId);
              const url = await QRCode.toDataURL(
                `${window.location.origin}/checkin/${tkn}_${data.sessionId}`,
                {
                  width: 300,
                  margin: 2,
                  color: {
                    dark: "#2563eb",
                    light: "#ffffff",
                  },
                },
              );
              localStorage.setItem("location", location);
              setQrCodeUrl(url);
              setIssend(true);
            });
         }
   
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setLocation("");
    setCourseCode("");
    setSessionType("");
    setSessionGroup("");
    setQrCodeUrl("");
    setTimeLeft(60);
    setIssend(false);
    
  };

const handleChange = (hall: string, schedules: ScheduleEntry[]) => {
  setLocation(hall);
seterror("");
  const entry = schedules.find((s) => s.Hall === hall);

  setCourseCode(entry?.Course || "");

  const type = entry?.TeachingMethod || "";
  setSessionType(
    type.toLowerCase().includes("lab")
      ? "lab"
      : type.toLowerCase().includes("tutorial")
        ? "tutorial"
        : "lecture",
  );
  setSessionGroup(entry?.Section || "");
  setInstructor(entry?.InstructorName || "");
};
  return (
    <div className=" w-full max-w-md mx-auto p-4 space-y-6 ">
      <div className="text-center space-y-2">
        <h1 className="text-primary">Start Attendance</h1>
        <p className="text-muted-foreground">Set up your attendance session</p>
      </div>

      <Card className="shadow-lg border-border ">
        <CardHeader>
          {qrCodeUrl ? (
            <>
              <CardTitle>Check In</CardTitle>
              <CardDescription>
                Students can scan this QR code to check in
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle>Session Details</CardTitle>
              <CardDescription>
                Enter the details for this attendance session
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className={`space-y-6  ${!qrCodeUrl && " fade-in"}`}>
          {!qrCodeUrl && (
            <>
              <div className="space-y-2">
                <Label htmlFor="location">Choose Location</Label>
                <Select
                  value={location}
                  onValueChange={(value) => handleChange(value, Schedules)}
                >
                  <SelectTrigger
                    id="location"
                    className="h-12 bg-input-background border-border"
                  >
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {Schedules.length > 0
                      ? Schedules.map((s: ScheduleEntry) => (
                          <SelectItem key={s.Course + s.Hall} value={s.Hall}>
                            {s.Hall}
                          </SelectItem>
                        ))
                      : "No locations available"}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="Instructor">Instructor DR / ENG</Label>
                <Input
                  id="Instructor"
                  type="text"
                  placeholder="Name"
                  disabled={Instructor ? true : false}
                  value={Instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="h-12 bg-input-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseCode">Enter Course Code</Label>
                <Input
                  id="courseCode"
                  type="text"
                  placeholder="e.g., CS101"
                  disabled={courseCode ? true : false}
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="h-12 bg-input-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionType">Session Type</Label>
                <Select
                  disabled={sessionType ? true : false}
                  value={sessionType}
                  onValueChange={setSessionType}
                >
                  <SelectTrigger
                    id="sessionType"
                    className="h-12 bg-input-background border-border"
                  >
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-red-600 text-sm">{error}</div>
              <Button
                onClick={generateQRCode}
                className="w-full h-14 text-lg"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate QR Code"}
              </Button>
            </>
          )}

          {qrCodeUrl && (
            <div className="fade-in  space-y-4 pt-4 border-t border-border">
              <div className="text-center ">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                    <div
                      className={` text-xl p-0 m-0 font-bold ${
                        timeLeft <= 5 ? "text-red-600" : "text-blue-600"
                      } transition-all duration-500`}
                    >
                      {timeLeft}S
                    </div>
                    <img
                      src={qrCodeUrl}
                      alt="Attendance QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Course:</span>{" "}
                    <span className="text-primary">{courseCode}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Type:</span>{" "}
                    <span className="text-primary capitalize">
                      {sessionType}
                    </span>

                    <span className="text-muted-foreground ml-4">Group:</span>{" "}
                    <span className="text-primary capitalize">
                      {sessionGroup}
                    </span>
                  </p>
                </div>
              </div>
              <Button
                onClick={resetForm}
                variant="outline"
                className="w-full h-12"
              >
                Create New Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
