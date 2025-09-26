"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Papa from "papaparse";
import jsPDF from "jspdf";
import { Loader2 } from "lucide-react";

export function ExportButtons() {
  const [loadingFormat, setLoadingFormat] = useState<"csv" | "pdf" | null>(
    null,
  );

  const handleExport = async (format: "csv" | "pdf") => {
    setLoadingFormat(format);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: entries } = await supabase
        .from("entries")
        .select("date, mood, content")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (entries) {
        if (format === "csv") {
          const csv = Papa.unparse(entries);
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", "mindful_moments.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (format === "pdf") {
          const doc = new jsPDF();
          doc.text("Mindful Moments Entries", 10, 10);
          entries.forEach((entry, index) => {
            const y = 20 + index * 40;
            const contentLines = doc.splitTextToSize(entry.content, 180);
            doc.text(
              `Date: ${new Date(entry.date).toLocaleDateString()}`,
              10,
              y,
            );
            doc.text(`Mood: ${entry.mood}`, 10, y + 7);
            doc.text(contentLines, 10, y + 14);
          });
          doc.save("mindful_moments.pdf");
        }
      }
    }
    setLoadingFormat(null);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleExport("csv")}
        disabled={loadingFormat !== null}
      >
        {loadingFormat === "csv" && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {loadingFormat === "csv" ? "Exporting..." : "Export to CSV"}
      </Button>
      <Button
        onClick={() => handleExport("pdf")}
        disabled={loadingFormat !== null}
      >
        {loadingFormat === "pdf" && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {loadingFormat === "pdf" ? "Exporting..." : "Export to PDF"}
      </Button>
    </div>
  );
}
