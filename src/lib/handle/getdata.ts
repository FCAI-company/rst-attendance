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
  const currentDay = "Monday";
  // now.toLocaleDateString("en-US", { weekday: "long" });
  const currentTime = "09:00:00";
  // now.toTimeString().slice(0, 8); // HH:MM:SS
  const currentClass = schedule.filter((item) => {
    return (
      item.Day === currentDay &&
      item.TimeFrom <= currentTime &&
      item.TimeTo >= currentTime
    );
  });
console.log(currentClass);
  return currentClass.length > 0 ? currentClass : "No class at the moment";
}