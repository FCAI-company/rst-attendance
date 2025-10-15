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
import { encryptData } from "@/lib/cryptoUtils";

export function InstructorSetupScreen() {
  const [location, setLocation] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20);

    useEffect(() => {
      if (qrCodeUrl) {
        if (timeLeft <= 0) {

          generateQRCode().then(() => {
            setTimeLeft(20);
          });
         
        }

        const timer = setInterval(() => {
          setTimeLeft((t) => t - 1);
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [timeLeft, qrCodeUrl]);
const hash = crypto.createHash("sha256");

 

const GenTkn = async() => {
     const sessionid =
       sessionType +
       "-" +
       courseCode +
       "-" +
       location +
       "-" +
       new Date().getFullYear() +
       "-" +
       (new Date().getMonth() + 1) +
       "-" +
       new Date().getDate();

 
 
     const tkn = crypto.randomBytes(16).toString("hex");
 
     await fetch("/api/qr", {
       method: "PUT",
       body: JSON.stringify(`${sessionid}_${tkn}`),
     });
  return `${sessionid}_${tkn}`;
};

  const generateQRCode = async () => {
    const ress = await fetch("/api/qr");
    const datas = await ress.json();
      
console.log("Existing records:", datas);


    if (!location || !courseCode || !sessionType) {
      alert("Please fill in all fields");
      return;
    }

    setIsGenerating(true);

    const attendanceData = JSON.stringify({
      location,
      courseCode,
      sessionType,
      timestamp: new Date().toISOString(),
    });

    try {

    
      const tkn=await GenTkn();
      const url = await QRCode.toDataURL(
        `${window.location.origin}/checkin/${tkn}`,
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
    setQrCodeUrl("");
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
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger
                    id="location"
                    className="h-12 bg-input-background border-border"
                  >
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building-a-201">
                      Building A - Room 201
                    </SelectItem>
                    <SelectItem value="building-b-lab3">
                      Building B - Lab 3
                    </SelectItem>
                    <SelectItem value="online">Online Session</SelectItem>
                    <SelectItem value="library-hall">Library Hall</SelectItem>
                    <SelectItem value="auditorium">Main Auditorium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseCode">Enter Course Code</Label>
                <Input
                  id="courseCode"
                  type="text"
                  placeholder="e.g., CS101"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="h-12 bg-input-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionType">Session Type</Label>
                <Select value={sessionType} onValueChange={setSessionType}>
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
