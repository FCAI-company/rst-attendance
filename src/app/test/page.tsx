"use client";

import { useState } from "react";
 interface Session {
  id?: number;
  userId: string;
  sessionId: string;
  createdAt: string;
}
export default function HomePage() {
  const [userId, setUserId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState([]);
   const loadRecords = async () => {
     const res = await fetch("/api/session");
     const data = await res.json();
     setSessions(data);
   };
  const handleSendToServer = async () => {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, sessionId }),
    });
loadRecords();
    const data = await res.json();
   
    setUserId("");
    setSessionId("");
    // alert("Server response: " + JSON.stringify(data));
  };

  return (
    <div className="flex flex-col gap-3 p-6 max-w-sm mx-auto">
      <input
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        placeholder="Session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        className="border p-2 rounded"
      />
      
      <button
        onClick={handleSendToServer}
        className="bg-green-500 text-white p-2 rounded"
      >
        Send to Server
      </button>

      <h2 className="text-xl font-semibold mt-6 mb-2">Saved Sessions</h2>
      {sessions.length === 0 ? (
        <p className="text-gray-500 text-sm">No sessions stored yet.</p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s:any) => (
            <li
              key={s.id}
              className="border p-2 rounded flex justify-between items-center bg-gray-50"
            >
              <div>
                <p className="text-sm font-semibold">User: {s.userId}</p>
                <p className="text-xs text-gray-600">Session: {s.sessionId}</p>
              </div>
              <span className="text-[10px] text-gray-400">
                {new Date(s.createdAt).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
