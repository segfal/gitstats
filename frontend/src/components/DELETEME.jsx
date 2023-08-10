import React from "react";

function MillisecondsToWeeksDaysHoursMinutes(milliseconds) {
  // Convert milliseconds to seconds
  const totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate weeks, days, hours, minutes, and seconds
  const weeks = Math.floor(totalSeconds / (7 * 24 * 60 * 60));
  const days = Math.floor((totalSeconds % (7 * 24 * 60 * 60)) / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return `${weeks} week${weeks !== 1 ? "s" : ""}, ${days} day${days !== 1 ? "s" : ""}, ${hours} hour${hours !== 1 ? "s" : ""}, ${minutes} minute${minutes !== 1 ? "s" : ""}, ${seconds} second${seconds !== 1 ? "s" : ""}`;
}

// Usage in the DeploymentFreq component remains the same...
