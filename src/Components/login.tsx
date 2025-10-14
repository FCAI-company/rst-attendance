"use client"
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from '@radix-ui/react-label';
import { Select } from './ui/select';
import { Input } from './ui/input';
import { useRouter } from "next/navigation";

export default function Login() {
    const [isLogin, setIsLogin] = useState(false);
      const router = useRouter();

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-primary">Start Attendance</h1>
        <p className="text-muted-foreground">Login</p>
      </div>

      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle>Login Details</CardTitle>
          <CardDescription>Enter the creadation details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">User Name</Label>
            <Input
              id="courseCode"
              type="text"
              placeholder="e.g., CS101"
              //   value={courseCode}
              //   onChange={(e) => setCourseCode(e.target.value)}
              className="h-12 bg-input-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseCode">Password</Label>
            <Input
              id="courseCode"
            
              type="password"
              placeholder="e.g., CS101"
              //   value={courseCode}
              //   onChange={(e) => setCourseCode(e.target.value)}
              className="h-12 bg-input-background border-border"
            />
          </div>

        

          <Button
             onClick={()=> router.push("/")}
            className="w-full h-14 text-lg"
            // disabled={isGenerating}
          >
            {isLogin ? "Load..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
