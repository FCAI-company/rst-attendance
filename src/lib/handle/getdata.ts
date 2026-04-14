"use client"
import { schedule, ScheduleEntry } from "../data/schedule";

export function getSchedule(): ScheduleEntry[] | string {
  // const date = new Date();
  // const days = [
  //   "Sunday",
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday"
  // ];

  // const dayName = days[date.getDay()];
  // const hour = date.getHours();
  const now = new Date();
  // ("Monday");

  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
 // ("09:00:00");
  //now.toTimeString().slice(0, 8)
  const currentTime = now.toTimeString().slice(0, 8);
  // "09:00:00"; // HH:MM:SS
  const currentClass = schedule.filter((item) => {
    return (
      item.Day === currentDay &&
      item.TimeFrom <= currentTime &&
      item.TimeTo >= currentTime
    );
  });
   
  return currentClass.length > 0 ? currentClass : "No class at the moment";
}