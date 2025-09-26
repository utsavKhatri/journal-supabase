"use client";

import { GradientBarChart } from "../ui/gradient-bar-chart";
import { Entry } from "@/lib/types";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklyActivityChart({
  entries,
}: {
  entries: Pick<Entry, "date">[];
}) {
  const activityData = daysOfWeek.map((day) => ({ name: day, entries: 0 }));

  entries.forEach((entry) => {
    const dayIndex = new Date(entry.date).getDay();
    activityData[dayIndex].entries += 1;
  });

  return (
    <GradientBarChart
      data={activityData}
      dataKey="entries"
      xKey="name"
      title={<span>Weekly Activity</span>}
      subtitle={null}
      config={{ entries: { label: "Entries", color: "var(--chart-1)" } }}
    />
  );
}
