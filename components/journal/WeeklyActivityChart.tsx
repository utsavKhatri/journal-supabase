"use client";

import { GradientBarChart } from "../ui/gradient-bar-chart";
import { Entry } from "@/lib/types";

// Defines the days of the week for the chart's x-axis.
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * The WeeklyActivityChart component visualizes the user's journaling activity across the days of the week.
 * It processes the journal entries to count the number of entries for each day and then renders the
 * data as a bar chart using the `GradientBarChart` component.
 */
export function WeeklyActivityChart({
  entries,
}: {
  entries: Pick<Entry, "date">[];
}) {
  // Initializes an array to hold the activity data for each day of the week.
  const activityData = daysOfWeek.map((day) => ({ name: day, entries: 0 }));

  // Processes each entry to increment the count for the corresponding day of the week.
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
