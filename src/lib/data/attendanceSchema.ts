import { z } from "zod";

// 🧾 Define what a valid attendance record looks like
export const AttendanceSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  sessionId: z.string().min(1, "sessionId required"),
  timestamp: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
});

// Array of records
export const AttendanceArraySchema = z.array(AttendanceSchema);

// ✅ Type inference from Zod
export type Attendance = z.infer<typeof AttendanceSchema>;
