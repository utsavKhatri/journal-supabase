"use client";

import { RoundedPieChart } from "@/components/ui/rounded-pie-chart";
import { Entry } from "@/lib/types";

/**
 * The MoodChart component visualizes the distribution of moods from journal entries.
 * It processes the entries to count the occurrences of each mood and then renders the
 * data as a pie chart using the `RoundedPieChart` component.
 */
export function MoodChart({
  entries,
  badgeContent,
}: {
  entries: Pick<Entry, "mood">[];
  badgeContent?: React.ReactNode;
}) {
  // Reduces the entries to a collection of moods and their counts.
  const moodData = entries.reduce(
    (acc: { name: string; value: number }[], entry: Pick<Entry, "mood">) => {
      const mood = entry.mood || "Unknown";
      const existingMood = acc.find((item) => item.name === mood);
      if (existingMood) {
        existingMood.value += 1;
      } else {
        acc.push({ name: mood, value: 1 });
      }
      return acc;
    },
    [] as { name: string; value: number }[]
  );

  // Maps the processed mood data to the format expected by the pie chart component.
  const pieData = moodData.map((item, idx) => ({
    name: item.name,
    visitors: item.value,
    fill: `var(--chart-${(idx % 5) + 1})`,
  }));

  return (
    <RoundedPieChart
      data={pieData}
      dataKey="visitors"
      title={<span>Mood Distribution</span>}
      subtitle={null}
      badgeContent={badgeContent}
    />
  );
}
